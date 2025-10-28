import { Menu, MenuItemConstructorOptions } from "electron";
import { Const } from "../lib/Const";

export class MenuHelper {
  private menu: Menu | null = null;

  constructor() {}
  setup(): void {
    // Setup menu related helpers here
    this.createMenu();
  }

  private createMenu() {
    if (this.menu !== null) return;

    const menuTemplate: MenuItemConstructorOptions[] = [
      {
        label: "File",
        submenu: [
          {
            label: "New",
            accelerator: "CmdOrCtrl+N",
            click: () => console.log("New file"),
          },
          { type: "separator" },
          { label: "Exit", role: "quit" },
        ],
      },
      {
        label: "Edit",
        submenu: [
          { role: "undo" },
          { role: "redo" },
          { type: "separator" },
          { role: "cut" },
          { role: "copy" },
          { role: "paste" },
        ],
      },
    ];

    if (Const.isMac) menuTemplate.unshift({ label: "" });

    this.menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(this.menu);
  }
}
