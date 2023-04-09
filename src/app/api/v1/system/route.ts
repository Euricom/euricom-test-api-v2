import { ok } from "@/server/httpUtils";
import { generateProducts } from "../products/repo";
import { generateUsers } from "../users/repo";
import { generateTasks } from "../tasks/repo";

export function DELETE() {
  generateProducts(100);
  generateUsers(100);
  generateTasks();

  return ok({ message: "Tasks, Product and User are (re)generated." });
}
