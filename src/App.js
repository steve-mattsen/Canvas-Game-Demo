import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [data, setData] = React.useState([]);
  const initFormData = { text: '' };
  const [formData, setFormData] = React.useState(initFormData);

  const grabData = () => {
    fetch("/api/todo/")
      .then((res) => res.json())
      .then((data) => setData(data))
  };
  React.useEffect(grabData, []);

  let onFormSubmit = (e) => {
    e.preventDefault();
    fetch("/api/todo", {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: formData.text })
    }).then(res => grabData())
    setFormData({ ...initFormData });
    return false;
  }

  let onTextInput = (e) => {
    setFormData({ ...formData, text: e.currentTarget.value });
  }

  return (
    <div className="App">
      {data && data.map((v, i) => <div key={i}>{v.text}</div>)}
      <form onSubmit={onFormSubmit} >
        <input type="text" id="newTodo" onChange={onTextInput} value={formData.text} />
        <input type="submit" text="Submit" disabled={formData.text == ''} />
      </form>
    </div>
  );
}

export default App;