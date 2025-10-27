/**
 * The renderer process is responsible for rendering the user interface of your Electron application.
 * Displays web pages (HTML, CSS, JavaScript).
 *
 * Each BrowserWindow instance in your Electron app runs in its own dedicated renderer process.
 *
 * Renderer processes, for security reasons, do not have direct access to Node.js APIs by default.
 * They are isolated from the operating system and the main process to prevent malicious web content from compromising the system.
 */

class RendererApp {
  private messageInput: HTMLInputElement;
  private sendButton: HTMLButtonElement;
  private outputDiv: HTMLDivElement;
  private systemInfoDiv: HTMLDivElement;

  constructor() {
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    document.addEventListener("DOMContentLoaded", () => {
      this.setupDOM();
      this.setupEventListeners();
      this.loadAppInfo();
      this.setupMainMessageListener();
    });
  }

  private setupDOM(): void {
    this.messageInput = document.getElementById(
      "messageInput"
    ) as HTMLInputElement;
    this.sendButton = document.getElementById(
      "sendButton"
    ) as HTMLButtonElement;
    this.outputDiv = document.getElementById("output") as HTMLDivElement;
    this.systemInfoDiv = document.getElementById(
      "systemInfo"
    ) as HTMLDivElement;
  }

  private setupEventListeners(): void {
    this.sendButton.addEventListener("click", () => this.handleSendMessage());
    this.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleSendMessage();
      }
    });
  }

  private async loadAppInfo(): Promise<void> {
    try {
      // Get app version
      const version = await window.electronAPI.getAppVersion();
      this.addOutput(`App Version: ${version}`);
      console.log("isMac : ", window.isMac);

      // Get system info
      const systemInfo = await window.electronAPI.getSystemInfo();
      this.displaySystemInfo(systemInfo);
    } catch (error) {
      this.addOutput(`Error loading app info: ${error}`);
    }
  }

  private displaySystemInfo(systemInfo: any): void {
    this.systemInfoDiv.innerHTML = `
      <h3>System Information:</h3>
      <p><strong>Platform:</strong> ${systemInfo.platform}</p>
      <p><strong>Architecture:</strong> ${systemInfo.arch}</p>
      <p><strong>Node.js Version:</strong> ${systemInfo.versions.node}</p>
      <p><strong>Electron Version:</strong> ${systemInfo.versions.electron}</p>
      <p><strong>Chrome Version:</strong> ${systemInfo.versions.chrome}</p>
    `;
  }

  private async handleSendMessage(): Promise<void> {
    const message = this.messageInput.value.trim();

    if (!message) {
      this.addOutput("Please enter a message");
      return;
    }

    try {
      this.addOutput(`Sending: ${message}`);
      const response = await window.electronAPI.showMessage(message);
      this.addOutput(`Response: ${response}`);
      this.messageInput.value = "";
    } catch (error) {
      this.addOutput(`Error sending message: ${error}`);
    }
  }

  private setupMainMessageListener(): void {
    window.electronAPI.onMessageFromMain((message: string) => {
      this.addOutput(`Main Process: ${message}`);
    });
  }

  private addOutput(message: string): void {
    const messageElement = document.createElement("div");
    messageElement.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    messageElement.style.padding = "5px";
    messageElement.style.borderBottom = "1px solid #eee";

    this.outputDiv.appendChild(messageElement);
    this.outputDiv.scrollTop = this.outputDiv.scrollHeight;
  }
}

// Initialize the renderer app
new RendererApp();
