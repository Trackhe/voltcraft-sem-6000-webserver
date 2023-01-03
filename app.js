const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.get('/endpoint1', (req, res) => {
    exec('python3 -c "print(\'Hello, World!\')"', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        res.send({ output: stdout });
    });
});

let data = `
  Status:
    Power:                off
    Voltage:              0 VAC
    Ampere:               0 A
    Watts:                0 W
    Frequency:            0 Hz
    Power factor:         0
  `;

setInterval(() => {
    exec('../sem-6000.exp f --status --print', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`)
        } else {
            data = stdout
        }
    })
}, 5000)

app.get('/', (req, res) => {

    let power = 0
    let voltage = 0
    let voltage_unit = 0
    let current = 0
    let current_unit = 0
    let watts = 0
    let watts_unit = 0
    let frequency = 0
    let frequency_unit = 0
    let power_factor = 0

    const row = /^.*$/gm
    const power_regex = /^\s*Power:\s+(on|off)$/gm
    const voltage_regex = /^\s*Voltage:\s+(\S+)\s+(\S+)$/gm
    const current_regex = /^\s*Ampere:\s+(\S+)\s+(\S+)$/gm
    const watts_regex = /^\s*Watts:\s+(\S+)\s+(\S+)$/gm
    const frequency_regex = /^\s*Frequency:\s+(\S+)\s+(\S+)$/gm
    const power_factor_regex = /^\s*Power factor:\s+(\S+)$/gm

    const rows = data.match(row)

    //while through the rows
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].indexOf("Power:") !== -1) {
            power = power_regex.exec(rows[i])[1]
        }
        if (rows[i].indexOf("Voltage:") !== -1) {
            voltage = voltage_regex.exec(rows[i])
            voltage_unit = voltage[2]
            voltage = voltage[1]
        }
        if (rows[i].indexOf("Ampere:") !== -1) {
            current = current_regex.exec(rows[i])
            current_unit = current[2]
            current = current[1]
        }
        if (rows[i].indexOf("Watts:") !== -1) {
            watts = watts_regex.exec(rows[i])
            watts_unit = watts[2]
            watts = watts[1]
        }
        if (rows[i].indexOf("Frequency:") !== -1) {
            frequency = frequency_regex.exec(rows[i])
            frequency_unit = frequency[2]
            frequency = frequency[1]
        }
        if (rows[i].indexOf("Power factor:") !== -1) {
            power_factor = power_factor_regex.exec(rows[i])[1]
        }
    }

    //console.log({ power, voltage, voltage_unit, current, current_unit, watts, watts_unit, frequency, frequency_unit, power_factor })

    res.send({
        power,
        voltage,
        voltage_unit,
        current,
        current_unit,
        watts,
        watts_unit,
        frequency,
        frequency_unit,
        power_factor
    });

})

app.get('/temperature', (req, res) => {
    const temperature = 25; // Get temperature from sensor or other source
    res.send({ temperature });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

