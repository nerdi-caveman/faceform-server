const fs = require("fs");
const os = require("os");

const errorHandler = () => {
  let _path = "";

  /**
   * Config the path to file log
   * @param  {string} path File path
   */
  const config = path => {
    _path = path + "error.log";
  };

  /**
   * Send error message to client and log to file path
   * @param  {object} response Express response object
   * @param  {string} error The error message
   * @param  {number} code The error message
   * @param  {boolean} log Should log to a file path configured, default value is false
   * @author Inioluwa Sogelola
   */
  const send = (res, error, code = 400, log = true) => {
    let networkInterfaces = os.networkInterfaces();
    //  local IPV4 address or machine connnected to Wi-Fi
    const ipAddress = networkInterfaces["Wi-Fi"]
      ? networkInterfaces["Wi-Fi"][1].address
      : networkInterfaces["vEthernet (Default Switch)"][1].address;

    const message = { error: { message: error }, code };
    if (log) {
      const date = new Date();
      const logMessage = `${date} (${ipAddress}) - ${
        code ? "status code " + code + ":" : ""
      } ${error}`;
      logtoFile(logMessage);
    }
    res.status(code).send(message);
  };

  /**
   * Checks if file exist and logs message to the file
   * @param {string} message Error message to be displayed
   * @param {string} path The file to write
   * @author Inioluwa Sogelola
   */
  const logtoFile = (message, path = _path) => {
    // write to file
    fs.appendFileSync(path, `${message}\n`);
  };

  return {
    config,
    send
  };
};
module.exports = errorHandler();
