const net = require('net');

const commonPorts = [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3389];

function scanPort(host, port, timeout = 500) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        let status = 'closed';

        socket.setTimeout(timeout);
        socket.on('connect', () => {
            status = 'open';
            socket.destroy();
        });
        socket.on('timeout', () => socket.destroy());
        socket.on('error', () => {});
        socket.on('close', () => resolve({ port, status }));

        socket.connect(port, host);
    });
}

module.exports = async function scanHost(host) {
    const results = await Promise.all(commonPorts.map(p => scanPort(host, p)));
    return results;
};
