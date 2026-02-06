import { useEffect, useMemo, useState } from "react";
import "./styles.css";
import fruitApple from "./assets/Fruits/Fruits_Separated/Apple.png";
import fruitBanana from "./assets/Fruits/Fruits_Separated/Banana.png";
import fruitCherry from "./assets/Fruits/Fruits_Separated/Cherry.png";
import fruitGrape from "./assets/Fruits/Fruits_Separated/Grape.png";
import fruitKiwi from "./assets/Fruits/Fruits_Separated/Kiwi.png";
import fruitLemon from "./assets/Fruits/Fruits_Separated/Lemon.png";
import fruitOrange from "./assets/Fruits/Fruits_Separated/Orange.png";
import fruitPeach from "./assets/Fruits/Fruits_Separated/Peach.png";
import fruitPear from "./assets/Fruits/Fruits_Separated/Pear.png";
import fruitPineapple from "./assets/Fruits/Fruits_Separated/Pineapple.png";
import fruitStrawberry from "./assets/Fruits/Fruits_Separated/Strawberry.png";
import fruitWatermelon from "./assets/Fruits/Fruits_Separated/Watermelon.png";

const STORAGE_KEY = "peachy-todos-react";

const STICKERS = [
  { value: "apple", label: "Apple", image: fruitApple },
  { value: "banana", label: "Banana", image: fruitBanana },
  { value: "cherry", label: "Cherry", image: fruitCherry },
  { value: "grape", label: "Grape", image: fruitGrape },
  { value: "kiwi", label: "Kiwi", image: fruitKiwi },
  { value: "lemon", label: "Lemon", image: fruitLemon },
  { value: "orange", label: "Orange", image: fruitOrange },
  { value: "peach", label: "Peach", image: fruitPeach },
  { value: "pear", label: "Pear", image: fruitPear },
  { value: "pineapple", label: "Pineapple", image: fruitPineapple },
  { value: "strawberry", label: "Strawberry", image: fruitStrawberry },
  { value: "watermelon", label: "Watermelon", image: fruitWatermelon },
];


const STICKER_VALUES = new Set(STICKERS.map((s) => s.value));
const PRIORITIES = [
  { value: "low", label: "Low", color: "low" },
  { value: "medium", label: "Medium", color: "medium" },
  { value: "high", label: "High", color: "high" },
];

const todayISO = () => new Date().toISOString().slice(0, 10);

const formatDate = (iso) => {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const buildCalendar = (year, month) => {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = first.getDay();
  const days = [];

  for (let i = 0; i < startDay; i += 1) {
    days.push(null);
  }
  for (let d = 1; d <= last.getDate(); d += 1) {
    const iso = new Date(year, month, d).toISOString().slice(0, 10);
    days.push(iso);
  }
  return days;
};

const useLocalTodos = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const loaded = JSON.parse(raw);
    setTodos(
      loaded.map((todo) => ({
        ...todo,
        priority: todo.priority || "medium",
        dueDate: todo.dueDate || "",
        sticker: STICKER_VALUES.has(todo.sticker) ? todo.sticker : "peach",
      }))
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  return [todos, setTodos];
};

const Dropdown = ({ label, value, options, onChange, icon }) => {
  const [open, setOpen] = useState(false);
  const current = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  return (
    <div className="dropdown" onClick={(event) => event.stopPropagation()}>
      <span className="sr-only">{label}</span>
      <button
        className="dropdown-trigger"
        type="button"
        onClick={() => setOpen((prev) => !prev)}
      >
        {icon && <span className="dropdown-icon">{icon}</span>}
        {current?.image && (
          <img className="sticker-icon" src={current.image} alt="" />
        )}
        <span>{label}: {current.label}</span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div className="dropdown-menu">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`dropdown-item${
                opt.value === value ? " active" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.icon && <span className="dropdown-icon">{opt.icon}</span>}
              {opt.image && (
                <img className="sticker-icon" src={opt.image} alt="" />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const DatePicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const base = value ? new Date(`${value}T00:00:00`) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = buildCalendar(year, month);
  const monthLabel = viewDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="datepicker" onClick={(event) => event.stopPropagation()}>
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="dropdown-icon">📅</span>
        <span>{value ? `Due: ${formatDate(value)}` : "Pick a due date"}</span>
        <span className="caret">▾</span>
      </button>
      {open && (
        <div className="calendar-pop">
          <div className="calendar-header">
            <button
              type="button"
              className="nav-btn"
              onClick={() =>
                setViewDate(new Date(year, month - 1, 1))
              }
            >
              ◂
            </button>
            <div className="month-label">{monthLabel}</div>
            <button
              type="button"
              className="nav-btn"
              onClick={() =>
                setViewDate(new Date(year, month + 1, 1))
              }
            >
              ▸
            </button>
          </div>
          <div className="calendar-grid">
            {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
              <div key={day} className="calendar-cell header">
                {day}
              </div>
            ))}
            {days.map((iso, index) => (
              <button
                key={`${iso || "empty"}-${index}`}
                type="button"
                className={`calendar-cell day${
                  iso === value ? " selected" : ""
                }${iso === todayISO() ? " today" : ""}`}
                disabled={!iso}
                onClick={() => {
                  onChange(iso);
                  setOpen(false);
                }}
              >
                {iso ? Number(iso.slice(-2)) : ""}
              </button>
            ))}
          </div>
          <div className="calendar-actions">
            <button
              type="button"
              className="btn ghost small"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
            >
              Clear
            </button>
            <button
              type="button"
              className="btn small"
              onClick={() => {
                onChange(todayISO());
                setOpen(false);
              }}
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [todos, setTodos] = useLocalTodos();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [sticker, setSticker] = useState("peach");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [immersive, setImmersive] = useState(false);

  const toggleImmersive = async () => {
    const next = !immersive;
    setImmersive(next);
    if (next) {
      if (document.documentElement.requestFullscreen) {
        try {
          await document.documentElement.requestFullscreen();
        } catch {}
      }
    } else if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch {}
    }
  };

  // Add a test task on initial render
  useEffect(() => {
    document.documentElement.classList.toggle("immersive", immersive);
    return () => document.documentElement.classList.remove("immersive");
  }, [immersive]);

  useEffect(() => {
    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        setImmersive(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  useEffect(() => {
    if (todos.length === 0) {
      setTodos([
        {
          id: crypto.randomUUID(),
          text: "Test task 1",
          done: false,
          createdAt: Date.now(),
          priority: "medium",
          dueDate: "",
          sticker: "peach",
        },
      ]);
    }
  }, [todos, setTodos]);

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.done);
    if (filter === "done") return todos.filter((todo) => todo.done);
    return todos;
  }, [filter, todos]);

  const counts = useMemo(() => {
    const done = todos.filter((todo) => todo.done).length;
    return { total: todos.length, done };
  }, [todos]);

  const addTodo = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        done: false,
        createdAt: Date.now(),
        priority,
        dueDate,
        sticker,
      },
      ...prev,
    ]);
    setText("");
  };

  return (
    <main className={`app${immersive ? " immersive" : ""}`}>
      <header className="header">
        <div className="title-block">
          <div className="pixel-badge">Cozy Mode</div>
        <button
          type="button"
          className="btn ghost small"
          onClick={toggleImmersive}
        >
          {immersive ? "Exit Immersive" : "Immersive View"}
        </button>
          <h1>Peachy To-Do List</h1>
          <p className="subtitle">A tiny, cozy list made with care.</p>
        </div>
        <div className="note-card">
          <div className="note-title">For you</div>
          <div className="note-body">
            Little tasks, soft colors, calm vibes. <span className="tiny">&lt;3</span>
          </div>
        </div>
      </header>

      <section className="composer">
        <div className="composer-main">
          <label className="sr-only" htmlFor="todo-input">Add a task</label>
          <input
            id="todo-input"
            className="input"
            type="text"
            placeholder="Add a gentle task..."
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") addTodo();
            }}
            maxLength={120}
          />
          <button className="btn primary" type="button" onClick={addTodo}>
            Add
          </button>
        </div>
        <div className="composer-extra">
          <Dropdown
            label="Priority"
            value={priority}
            options={PRIORITIES}
            onChange={setPriority}
            icon="⚑"
          />
          <DatePicker value={dueDate} onChange={setDueDate} />
          <Dropdown
            label="Sticker"
            value={sticker}
            options={STICKERS}
            onChange={setSticker}
            icon="✿"
          />
        </div>
      </section>

      <section className="controls">
        <div className="stats">
          <span>{counts.total}</span> total
          <span className="dot"></span>
          <span>{counts.done}</span> done
        </div>
        <div className="filters">
          {["all", "active", "done"].map((value) => (
            <button
              key={value}
              type="button"
              className={`btn ghost${filter === value ? " primary" : ""}`}
              onClick={() => setFilter(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn subtle"
          onClick={() => setTodos((prev) => prev.filter((todo) => !todo.done))}
        >
          Clear done
        </button>
      </section>

      <ul className="list" aria-live="polite">
        {filtered.map((todo) => {
          const stickerInfo = STICKERS.find((s) => s.value === todo.sticker);
          return (
            <li key={todo.id} className={`item${todo.done ? " done" : ""}`}>
              <button
                type="button"
                className={`checkbox${todo.done ? " checked" : ""}`}
                onClick={() =>
                  setTodos((prev) =>
                    prev.map((item) =>
                      item.id === todo.id
                        ? { ...item, done: !item.done }
                        : item
                    )
                  )
                }
              >
                <span className="sr-only">Toggle done</span>
                <span className="checkmark" aria-hidden="true"></span>
              </button>
              <div className="item-body">
                <div className="item-text">{todo.text}</div>
                <div className="item-meta">
                  <span className={`badge priority-${todo.priority}`}>
                    Priority: {todo.priority}
                  </span>
                  <span className="badge sticker">
                    {stickerInfo?.image && (
                      <img
                        src={stickerInfo.image}
                        alt=""
                      />
                    )}
                    {stickerInfo?.label}
                  </span>
                  {todo.dueDate && (
                    <span className="badge">Due: {formatDate(todo.dueDate)}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="remove"
                onClick={() =>
                  setTodos((prev) => prev.filter((item) => item.id !== todo.id))
                }
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </main>
  );
}