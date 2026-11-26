import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renderiza el texto y responde al clic", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Aceptar</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Aceptar" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("no dispara el clic cuando está deshabilitado", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Aceptar
      </Button>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Aceptar" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("marca aria-busy y bloquea el envío mientras carga", () => {
    render(<Button isLoading>Aceptar</Button>);

    const button = screen.getByRole("button", { name: "Aceptar" });

    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });
});
