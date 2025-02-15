import { computePosition, autoUpdate, flip, shift } from "@floating-ui/dom";

export function init() {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-button");
    const menu = dropdown.querySelector(".dropdown-menu");

    async function updateDropdownPosition() {
      const { x, y } = await computePosition(button, menu, {
        placement: "bottom-start",
        middleware: [flip(), shift()],
      });

      Object.assign(menu.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    }

    button.addEventListener("click", async (event) => {
      event.stopPropagation();

      const isOpen = !menu.classList.contains("hidden");

      document.querySelectorAll(".dropdown-menu").forEach((otherMenu) => {
        if (otherMenu !== menu) {
          otherMenu.classList.add("hidden");
        }
      });

      if (isOpen) {
        menu.classList.add("hidden");
      } else {
        menu.classList.remove("hidden");
        await updateDropdownPosition();
        autoUpdate(button, menu, updateDropdownPosition);
      }
    });

    document.addEventListener("click", (event) => {
      if (!button.contains(event.target)) {
        menu.classList.add("hidden");
      }
    });
  });
}

export function selectItemByValue(value, selector) {
  const item = document.querySelector(`${selector} a[data-value="${value}"]`);
  selectItem(item);
}

function selectItem(item) {
  const button = item.parentElement.previousElementSibling;
  button.textContent = item.textContent.trim();
}

export function createDropdownItem(dropdown, text, value, onItemSelected) {
  const item = document.createElement("a");
  item.href = "#";
  item.classList.add("menu-item");
  item.textContent = text;
  item.setAttribute("data-value", value);
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    selectItem(item);
    const value = item.getAttribute("data-value");
    onItemSelected(value);
    closeDropdown(dropdown);
  });

  function closeDropdown(dropdown) {
    dropdown.classList.add("hidden");
  }

  dropdown.appendChild(item);
}
