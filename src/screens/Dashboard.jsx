import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addOrUpdateTask = async () => {
    if (!title.trim()) return;

    if (editingId) {
      await API.put(`/tasks/${editingId}`, { title });
      setEditingId(null);
    } else {
      await API.post("/tasks", { title });
    }

    setTitle("");
    fetchTasks();
  };

  const markCompleted = async (id) => {
    await API.patch(`/tasks/${id}`);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const startEdit = (task) => {
    setTitle(task.title);
    setEditingId(task._id);
  };

  const activeTasks = tasks.filter(
    (t) =>
      !t.completed &&
      t.title.toLowerCase().includes(search.toLowerCase())
  );

  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* HEADER */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold">Dashboard</h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">
            Task management with full CRUD operations
          </p>
        </div>

        {/* ADD / UPDATE */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? "Update Task" : "Add New Task"}
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addOrUpdateTask}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search active tasks..."
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* ACTIVE TASKS */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Active Tasks</h3>

          {activeTasks.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-400">
              No active tasks
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col"
                >
                  {/* TOP ACTION BAR */}
                  <div className="flex justify-between mb-3">
                    <button
                      onClick={() => startEdit(task)}
                      className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-500 transition"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-500 transition"
                    >
                      Delete
                    </button>
                  </div>

                  {/* TITLE */}
                  <p className="font-medium text-white mb-6 break-words">
                    {task.title}
                  </p>

                  {/* BOTTOM GREEN BUTTON */}
                  <button
                    onClick={() => markCompleted(task._id)}
                    className="mt-auto w-full px-4 py-2 bg-green-600 hover:bg-green-500 rounded-md text-sm transition"
                  >
                    Mark as Completed
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* COMPLETED TASKS */}
        <section>
          <h3 className="text-xl font-semibold mb-4 text-green-400">
            Completed Tasks
          </h3>

          {completedTasks.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center text-gray-500">
              No completed tasks
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex justify-between items-center"
                >
                  <p className="line-through text-gray-500 break-words">
                    {task.title}
                  </p>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="px-3 py-1 text-sm rounded-md bg-red-600 hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
