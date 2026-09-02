import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Contact } from "../Contact";

describe("Contact form", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_FORMSPREE_ENDPOINT", "https://example.test/form");
  });

  it("marks required fields and submits to the configured handler", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    render(<Contact />);

    expect(screen.getByLabelText("Name")).toBeRequired();
    expect(screen.getByLabelText("Email")).toBeRequired();
    expect(screen.getByLabelText("Message")).toBeRequired();

    await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Message"), "Let's talk about the sensory platform.");
    await user.click(screen.getByRole("button", { name: /Send message/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/form",
      expect.objectContaining({
        method: "POST",
        headers: { Accept: "application/json" },
      }),
    );
    expect(await screen.findByText("Message sent.")).toBeInTheDocument();
  });
});

