
async function init() {
    let data;
    if (window.dashboardData) {
        data = window.dashboardData;
    } else {
        const response = await fetch('data.json');
        data = await response.json();
    }

    // Update Summary Stats
    const totalM = data.total_stats.male;
    const totalF = data.total_stats.female;
    const totalAll = totalM + totalF;
    
    document.getElementById('total-teachers').textContent = totalAll.toLocaleString();
    document.getElementById('male-ratio').textContent = ((totalM / totalAll) * 100).toFixed(1) + '%';
    document.getElementById('female-ratio').textContent = ((totalF / totalAll) * 100).toFixed(1) + '%';
    
    let subTotal = 0;
    Object.values(data.total_stats.subjects).forEach(v => subTotal += v);
    document.getElementById('subject-ratio').textContent = ((subTotal / totalAll) * 100).toFixed(1) + '%';

    // Region Chart
    new Chart(document.getElementById('regionChart'), {
        type: 'bar',
        data: {
            labels: data.regions,
            datasets: [
                {
                    label: '남교사',
                    data: data.regions.map(r => data.regional_data[r].male_total),
                    backgroundColor: '#3b82f6'
                },
                {
                    label: '여교사',
                    data: data.regions.map(r => data.regional_data[r].female_total),
                    backgroundColor: '#ec4899'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // Subject Chart
    const subLabels = Object.keys(data.total_stats.subjects).filter(s => data.total_stats.subjects[s] > 0);
    new Chart(document.getElementById('subjectChart'), {
        type: 'pie',
        data: {
            labels: subLabels,
            datasets: [{
                data: subLabels.map(s => data.total_stats.subjects[s]),
                backgroundColor: [
                    '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f43f5e',
                    '#fbbf24', '#10b981', '#06b6d4', '#3b82f6', '#475569'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });

    // Class Type Chart
    let genM = 0, genF = 0, specM = 0, specF = 0;
    data.regions.forEach(r => {
        genM += data.regional_data[r].general_m;
        genF += data.regional_data[r].general_f;
        specM += data.regional_data[r].special_m;
        specF += data.regional_data[r].special_f;
    });

    new Chart(document.getElementById('classTypeChart'), {
        type: 'bar',
        data: {
            labels: ['일반학급', '특수학급'],
            datasets: [
                {
                    label: '남교사',
                    data: [genM, specM],
                    backgroundColor: '#3b82f6'
                },
                {
                    label: '여교사',
                    data: [genF, specF],
                    backgroundColor: '#ec4899'
                }
            ]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            },
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

init();
