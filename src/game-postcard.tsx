import { useEffect, useRef, useState } from "react";
import { Camera, Download, X } from "lucide-react";

export function GamePostcard({
  room,
  onPause,
  onResume,
}: {
  room: string;
  onPause: () => void;
  onResume: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [image, setImage] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    const receive = (event: Event) => {
      const data = (event as CustomEvent<string | null>).detail;
      setImage(data ?? "");
      setError(!data);
      dialog.current?.showModal();
    };
    window.addEventListener("portfolio-postcard-ready", receive);
    return () =>
      window.removeEventListener("portfolio-postcard-ready", receive);
  }, []);
  return (
    <>
      <button
        type="button"
        ref={trigger}
        onClick={() => {
          document.exitPointerLock?.();
          onPause();
          window.dispatchEvent(new Event("portfolio-take-postcard"));
        }}
      >
        <Camera aria-hidden="true" /> Postcard
      </button>
      <dialog
        ref={dialog}
        className="game-postcard"
        aria-labelledby="postcard-title"
        onKeyDown={(event) => {
          if (event.key === "Escape") event.stopPropagation();
        }}
        onClose={() => {
          onResume();
          trigger.current?.focus();
        }}
      >
        <header>
          <div>
            <p>A moment from the long way through</p>
            <h2 id="postcard-title">{room}</h2>
          </div>
          <button
            type="button"
            aria-label="Close postcard"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </header>
        {image && (
          <img
            src={image}
            alt={`A postcard of ${room} from the current viewpoint in Josiah’s 3D world.`}
          />
        )}
        {error && (
          <p role="status">
            This view could not be captured. Close the postcard and try another
            viewpoint.
          </p>
        )}
        <footer>
          <span>
            Look around. Find your frame. Take a little piece with you.
          </span>
          {image && (
            <a href={image} download="josiah-world-postcard.png">
              <Download size={18} /> Save postcard
            </a>
          )}
        </footer>
      </dialog>
    </>
  );
}
