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

app.get('/', (req, res) => {
    //exec('python3 script.py', (error, stdout, stderr) => {
        //if (error) {
        //    console.error(`exec error: ${error}`);
        //    return;
        //}

        const stdout = `
    Status:
      Power:                on
      Voltage:              229 VAC
      Ampere:               1.136 A
      Watts:                185.161 W
      Frequency:            50 Hz
      Power factor:         0.71
    `;

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
        const power_factor_regex = /^\s*Power Factor:\s+(\S+)$/gm

        const rows = stdout.match(row)
        //while through the rows
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].indexOf("Power:") !== -1) {
                power = power_regex.exec(rows[i])[1]
                console.log(power)
            }
            if (rows[i].indexOf("Voltage:") !== -1) {

                voltage = voltage_regex.exec(rows[i])[1]
                voltage_unit = voltage_regex.exec(rows[i])[2]
            }
            if (rows[i].indexOf("Ampere:") !== -1) {
                current = current_regex.exec(rows[i])[1]
                current_unit = current_regex.exec(rows[i])[2]
            }
            if (rows[i].indexOf("Watts:") !== -1) {
                watts = watts_regex.exec(rows[i])[1]
                watts_unit = watts_regex.exec(rows[i])[2]
            }
            if (rows[i].indexOf("Frequency:") !== -1) {
                frequency = frequency_regex.exec(rows[i])[1]
                frequency_unit = frequency_regex.exec(rows[i])[2]
            }
            if (rows[i].indexOf("Power Factor:") !== -1) {
                power_factor = power_factor_regex.exec(rows[i])[1]
            }
        }

        //console.log({ power, voltage, voltage_unit, current, current_unit, watts, watts_unit, frequency, frequency_unit, power_factor })


        //res.send({ power, voltage, voltage_unit, current, current_unit, watts, watts_unit, frequency, frequency_unit, power_factor });
    //});
});

app.get('/temperature', (req, res) => {
    const temperature = 25; // Get temperature from sensor or other source
    res.send({ temperature });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});