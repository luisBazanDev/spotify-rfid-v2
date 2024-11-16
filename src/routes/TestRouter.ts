import { Router } from "express";
import spotifyService from "../services/SpotifyService";
import { playRFID } from "../services/RFIDService";
import SerialPortService, {
  listAllSerialPorts,
  openSerialPort,
} from "../services/SerialPortService";

const test = Router();

test.get("/valid", async (req, res) => {
  const valid = await spotifyService.validToken();

  res.json({
    valid_token: valid,
  });
});

test.get("/scan", async (req, res) => {
  const rfid = req.query.rfid as string;

  if (!rfid) {
    res.json({
      error: "No RFID provided",
    });
    return;
  }

  let play = await playRFID(rfid);

  res.json({
    play: play,
  });
});

test.get("/ports", async (req, res) => {
  const port = req.query.port as string;

  if (
    !port ||
    !(await listAllSerialPorts()).map((x) => x.path).includes(port)
  ) {
    res.send(
      (await listAllSerialPorts())
        .map(
          (port: any) =>
            `<a href="./ports?port=${port.path}">${port.path} | ${port.friendlyName}</a><br/>`
        )
        .join("")
    );
    return;
  }

  await openSerialPort(port);

  if (SerialPortService.getInstance() === null) {
    res.json({ error: "Serial port service is null" });
    return;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      const portOpened = SerialPortService.getInstance()?.isOpen() ?? false;

      res.json({
        port: port,
        status: portOpened,
      });
      resolve();
    }, 300);
  });
});

export default test;
