import { useState } from "react";

function Contact() {
  const [message, setMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  return (
    <main>
      <h1>Contact Me</h1>

      <label htmlFor="message">Your Message</label>

      <textarea
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message..."
        rows="6"
      />

      <p>Your message: {message}</p>

      <button onClick={() => setShowHelp(!showHelp)}>
        {showHelp ? "Hide Help" : "Need Help?"}
      </button>

      {showHelp && (
        <p>
          You can write a message here if you want to contact me about a
          project or collaboration.
        </p>
      )}
    </main>
  );
}

export default Contact;