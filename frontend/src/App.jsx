import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload a file first");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/extract-text/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setText(data.extracted_text);
    } catch (err) {
      console.error(err);
      alert("Error extracting text");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧠 Text Extractor</h1>

      {/* Hidden file input */}
      <input
        id="fileInput"
        type="file"
        accept="image/*,.pdf"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* Clickable upload box */}
      <div
        style={styles.dropZone}
        onClick={() => document.getElementById("fileInput").click()}
      >
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>📂 Click to Upload Image or PDF</p>
        )}
      </div>

      {/* Upload Button */}
      <button onClick={handleUpload} style={styles.button}>
        {loading ? "Processing..." : "Extract Text"}
      </button>

      {/* Output */}
      <div style={styles.output}>
        <h3>Output:</h3>
        <pre style={styles.pre}>
          {text || "Your extracted text will appear here..."}
        </pre>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    fontFamily: "Arial",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },
  title: {
    fontSize: "40px",
    marginBottom: "20px",
  },
  dropZone: {
    border: "2px dashed #aaa",
    padding: "40px",
    margin: "20px auto",
    width: "320px",
    cursor: "pointer",
    borderRadius: "10px",
    background: "#1e293b",
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#3b82f6",
    color: "white",
  },
  output: {
    marginTop: "30px",
    textAlign: "left",
    maxWidth: "700px",
    marginInline: "auto",
    background: "#f5f5f5",
    color: "#000",
    padding: "20px",
    borderRadius: "10px",
    maxHeight: "300px",
    overflowY: "auto",
  },
  pre: {
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    fontFamily: "monospace",
  },
};

export default App;