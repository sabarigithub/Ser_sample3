(() => {
    'use strict'

    const form = document.getElementById('serverForm')

    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        } else {
            event.preventDefault()
            addServerToTable()
            form.reset()
            form.classList.remove('was-validated')
        }

        form.classList.add('was-validated')
    }, false)
})()

function togglePasswordVisibility() {
    const passwordField = document.getElementById('password')
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password'
}

function addServerToTable() {
    const table = document.getElementById('serversTable').getElementsByTagName('tbody')[0]
    const newRow = table.insertRow()

    const cells = [
        document.getElementById('serverName').value,
        document.getElementById('hostIp').value,
        document.getElementById('sshPort').value,
        document.getElementById('username').value,
        '<span class="badge bg-success">Connected</span>',
        `<button class="btn btn-sm btn-danger" onclick="deleteServer(this)">Delete</button>`
    ]

    cells.forEach((cellContent, index) => {
        const cell = newRow.insertCell(index)
        cell.innerHTML = cellContent
    })
}

function deleteServer(button) {
    const row = button.closest('tr')
    row.parentNode.removeChild(row)
}

// Placeholder for actual connection test
function testConnection() {
    // You would implement actual connection logic here
    alert('Connection test functionality would go here')
}


// Basic tab navigation
/*document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        // Hide all sections
        
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('d-none');
        });
        // Show target section
        const target = this.getAttribute('href').substring(1);
        document.getElementById(target).classList.remove('d-none');
    });
});*/

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default link behavior (which would navigate)

        // Get the href of the clicked link
        const href = this.getAttribute('href');

        // Check if the link is pointing to a new HTML page
        if (href.includes('.html')) {
            // If it is a new page, redirect to that page
            window.location.href = href;  // Navigate to the new HTML page
        } else {
            // Hide all sections on the current page
            document.querySelectorAll('section').forEach(section => {
                section.classList.add('d-none');
            });

            // Show the target section (based on the href attribute value)
            const target = href.substring(1);  // Remove the "#" from the href
            const targetSection = document.getElementById(target);

            if (targetSection) {
                targetSection.classList.remove('d-none');
            }
        }
    });
});



document.querySelectorAll('.dropdown-item').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('d-none');
        });
        // Show target section
        const target = this.getAttribute('href').substring(1);
        document.getElementById(target).classList.remove('d-none');
    });
});

document.querySelectorAll('.server-monitor').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('d-none');
        });
        // Show target section
        const target = this.getAttribute('href').substring(1);
        document.getElementById(target).classList.remove('d-none');
    });
});

/* Configure button */
document.getElementById("configure-toggle").addEventListener("click", function () {
    let configureItems = document.getElementById("configure-items");
    if (configureItems.style.display === "none" || configureItems.style.display === "") {
        configureItems.style.display = "block";
    } else {
        configureItems.style.display = "none";
    }
});


/* Server monitoing script */
// Function to fetch and update monitoring data
async function fetchData() {
    try {
        //const response = await fetch('/monitor');
        const data = await response.json();

        // Update System Information
        document.getElementById('hostname').textContent = data.hostname;
        document.getElementById('os').textContent = data.hostip;
        document.getElementById('uptime').textContent = data.cpu_uptime;
        document.getElementById('cpu-cores').textContent = data.cpu_count.logical_cpus;

        // Update CPU Utilization
        const cpuProgress = document.getElementById('cpu-progress');
        cpuProgress.style.width = `${data.cpu_utilization}%`;
        cpuProgress.textContent = `${data.cpu_utilization}%`;

        // Update Memory Usage
        const memoryUsedPercent = (data.memory_info.used / data.memory_info.total * 100).toFixed(1);
        const memoryAvailablePercent = (100 - memoryUsedPercent).toFixed(1);

        document.getElementById('memory-used-progress').style.width = `${memoryUsedPercent}%`;
        document.getElementById('memory-used-progress').textContent = `${memoryUsedPercent}%`;
        document.getElementById('memory-available-progress').style.width = `${memoryAvailablePercent}%`;
        document.getElementById('memory-available-progress').textContent = `${memoryAvailablePercent}%`;

        // Update Disk Usage

        // Update Disk Usage
        const diskUsageDiv = document.getElementById('disk-usage');
        diskUsageDiv.innerHTML = `
<div class="metric-label">Total Space: ${data.hdd_info.total.toFixed(2)} GB</div>
   <div class="progress">
        <div class="progress-bar" 
        role="progressbar" 
        style="width: ${data.hdd_info.percent}%"
        aria-valuenow="${data.hdd_info.percent}" 
        aria-valuemin="0" 
        aria-valuemax="100">
        ${data.hdd_info.percent}%
</div>
</div>
<div class="row mt-2">
<div class="col-md-4">
    <div class="metric-label">Used</div>
    <div class="text-danger">${data.hdd_info.used.toFixed(2)} GB</div>
</div>
<div class="col-md-4">
    <div class="metric-label">Free</div>
<div class="text-success">${data.hdd_info.free.toFixed(2)} GB</div>
</div>
<div class="col-md-4">
    <div class="metric-label">Utilization</div>
    <div class="text-primary">${data.hdd_info.percent}%</div>
</div>
</div>
`;


        // Update Network Interfaces
        const networkInterfacesDiv = document.getElementById('network-interfaces');
        networkInterfacesDiv.innerHTML = Object.entries(data.network_interfaces).map(([name, info]) => `
            <div class="network-interface">
                <div class="metric-label">${name}</div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error fetching monitoring data:', error);
    }
}

// Fetch data immediately and then every 2 seconds
fetchData();
setInterval(fetchData, 5000);