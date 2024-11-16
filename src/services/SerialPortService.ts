import { SerialPort, ReadlineParser } from "serialport";
import { playRFID } from "./RFIDService";

export async function listAllSerialPorts() {
  return SerialPort.list();
}

export async function openSerialPort(port: string) {
  if (instance?.isOpen()) {
    return;
  }

  new SerialPortService(port);
}

let instance: SerialPortService | null = null;

class SerialPortService {
  private port: string;
  private serialPort: SerialPort;

  constructor(port: string) {
    this.port = port;
    this.serialPort = this.open();

    this.serialPort.on("open", () => {
      console.log("Port opened");
      console.log(this.isOpen());
    });

    this.serialPort.on("close", () => {
      console.log("Port closed");
    });

    this.serialPort.on("error", (err) => {
      console.error(err);
    });

    const parser = this.serialPort.pipe(
      new ReadlineParser({ delimiter: "\r\n" })
    );

    parser.on("data", this.onData);

    instance = this;
  }

  public open() {
    return new SerialPort({
      baudRate: 9600,
      path: this.port,
      parity: "none",
    });
  }

  public isOpen() {
    return this.serialPort.isOpen;
  }

  private onData(data: string) {
    let args = data.split("|");
    let command = args.shift();

    switch (command) {
      case "RFID":
        playRFID(args[0]);
        break;
      default:
        console.log(`Unknown command: ${command}`);
        break;
    }
  }

  static getInstance() {
    return instance;
  }
}

export default SerialPortService;
