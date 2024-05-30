import Swal from "sweetalert2";
import TomSelect from "tom-select";

document.addEventListener("DOMContentLoaded", function () {
    async function choosePeriods(classId) {
        const periods = await getPeriods(classId);
        const periodSelectInstance = new TomSelect("#session-select", {
            items: [periods[0]?.scheduleId],
            options: periods,
            valueField: 'scheduleId',
            labelField: 'period',
            searchField: 'className',
            selectOnTab: true,
            addPrecedence: true,
            placeholder: "Chọn tiết học...",
            allowEmptyOption: false,
            create: false,
            maxItems: 1,
            preload: true,
            onChange: (value) => {
                periodSelectInstance.blur();
            },
            onDelete: (value, event) => {
                Swal.fire({
                    title: "Lỗi!",
                    text: "Không được trống, vui lòng chọn một tiết học",
                    icon: 'error',
                })
                return false;
            }
        });
    }

    async function chooseClassTakeNote() {
        const result = await getClasses();
        const classes = result.classes;
        const classSelectInstance = new TomSelect('#class-select', {
            options: classes.length ? classes : [{ id: 0, className: 'Bạn không có tiết vào hôm nay!' }],
            valueField: 'id',
            labelField: 'className',
            searchField: 'className',
            selectOnTab: true,
            addPrecedence: true,
            placeholder: "Chọn lớp...",
            create: false,
            maxItems: 1,
            plugins: ['remove_button'],
            preload: true,
            onItemAdd: async (value, item) => {
                classSelectInstance.blur();
                $('#content').toggleClass("d-none", false);
                $('.btn-gp').toggleClass("d-none", false);
                await Promise.all([
                    choosePeriods(value),
                    chooseLessons()
                ])

            },
            onItemRemove: (value, item) => {
                resetForm();
                $('#content').toggleClass("d-none", true);
                $('.btn-gp').toggleClass("d-none", true);
                $('#session-select')[0].tomselect.destroy();
                $('#lesson-select')[0].tomselect.destroy();
            },
            render: {
                option: function (data, escape) {
                    if (data.id === 0) {
                        return '<div class="option no-results">' + escape(data.className) + '</div>';
                    } else {
                        return '<div class="option">' + escape(data.className) + '</div>';
                    }
                }
            }
        });
    }

    async function chooseLessons() {
        const lessons = await getLessons();
        const lessonSelectInstance = new TomSelect("#lesson-select", {
            options: lessons,
            valueField: 'id',
            labelField: 'title',
            searchField: ['title', 'description'],
            selectOnTab: true,
            addPrecedence: true,
            placeholder: "Chọn bài học...",
            allowEmptyOption: false,
            create: false,
            maxItems: 1,
            preload: true,
            onChange: (value) => {
                lessonSelectInstance.blur();
            }
        });
    }

    async function getClasses() {
        try {
            const response = await fetch('/notebook/classes');
            if (response && response.status === 200) {
                const res = await response.json();
                return res;
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async function getPeriods(classId) {
        try {
            const response = await fetch(`/notebook/periods/${classId}`);
            if (response && response.status === 200) {
                const res = await response.json();
                return res;
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async function getLessons() {
        try {
            const response = await fetch(`/notebook/lessons`);
            if (response && response.status === 200) {
                const res = await response.json();
                return res;
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async function formValidation() {
        var form = document.getElementById('note-form');
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            let isValid = true;
            if (form.checkValidity() === false) {
                event.stopPropagation();
                isValid = false
            }
            form.classList.add('was-validated');

            if (isValid) {
                const formElement = event.target;
                const formData = new FormData(formElement);
                const data = {};
                formData.forEach((value, key) => data[key] = value);

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        showAlert('Lưu sổ đầu bài thành công!');
                    }
                }
                catch (error) {
                    console.error('Error:', error);
                    showAlert('Lưu sổ đầu bài thất bại, vui lòng kiểm tra lại đầu vào!', true);
                }
            }
        }, false);
    }

    function resetForm() {
        const form = document.getElementById('note-form');
        form.reset();
        form.classList.remove('was-validated');

        const classSelectInstance = document.getElementById('class-select').tomselect;
        classSelectInstance.clear();
    }

    function resetFormBtn() {
        let resetBtn = document.getElementById('reset-btn');
        resetBtn.addEventListener('click', resetForm);
    }

    function showAlert(message, isError = false) {
        const alertType = isError ? 'alert-danger' : 'alert-success';
        const $alert = $('.alert');

        $alert
            .removeClass('d-none alert-success alert-danger')
            .text(message);

        requestAnimationFrame(() => {
            $alert.addClass(`${alertType} show`);

            setTimeout(() => {
                $alert.removeClass('show');
                setTimeout(() => {
                    $alert.addClass('d-none');
                }, 300);
            }, 3000);
        });
    }

    function formatTableDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    async function initializeScheduleTbl() {
        let classSelectInstance = document.getElementById('class-history-select')?.tomselect;
        let weekSelectInstance = document.getElementById('week-history-select')?.tomselect;

        let classId, week;

        classId = classSelectInstance?.getValue();
        week = weekSelectInstance.getValue();

        // Empty rows
        const tableBody = document.querySelector('#schedule-table tbody');
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach((row, index) => {
            let startColumn;
            if ([0, 9, 18, 27, 36].includes(index)) {
                startColumn = 3;
            } else if ([5, 14, 23, 32, 41].includes(index)) {
                startColumn = 2;
            } else {
                startColumn = 1;
            }
            for (let i = startColumn; i < row.cells.length; i++) {
                row.cells[i].textContent = '';
            }
        });

        const data = await getNote(classId, week);
        if (data) {
            data.notes.forEach(item => {
                const dayOffset = (item.day_of_week - 1) * 9;
                const periodOffset = item.periodId - 1;
                const rowIndex = dayOffset + periodOffset;

                const row = tableBody.querySelectorAll('tr')[rowIndex];

                if (row) {
                    let startColumn;
                    if ([0, 9, 18, 27, 36].includes(rowIndex)) {
                        startColumn = 4;
                    } else if ([5, 14, 23, 32, 41].includes(rowIndex)) {
                        startColumn = 3;
                    } else {
                        startColumn = 2;
                    }

                    const values = [
                        item.subjectName,
                        item.lessonName,
                        item.note,
                        item.point,
                        item.className,
                        item.teacherName,
                        formatTableDate(item.created_at),
                        formatTableDate(item.updated_at)
                    ];

                    values.forEach((value, index) => {
                        row.querySelector(`td:nth-child(${startColumn + index})`).textContent = value;
                    });
                } else {
                    console.error('Row not found for', item);
                }
            });
        }
    }

    async function getClassesFromHistory() {
        try {
            const response = await fetch('/notebook/history/class', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isTrackHistory: true })
            });
            if (response && response.status === 200) {
                const res = await response.json();
                return res;
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async function chooseClassTrackHistory() {
        const result = await getClassesFromHistory();
        const classes = result.classes;
        const roleId = result.roleId;
        if (roleId !== 2) { // Not a normal Teacher
            const homeroomClass = classes.find(cls => cls.isHomeroomTeacher);
            const classSelectInstance = new TomSelect('#class-history-select', {
                options: classes.length ? classes : [{ id: 0, className: 'Bạn không có tiết vào hôm nay!' }],
                items: homeroomClass ? [homeroomClass.id] : classes[0].id,
                valueField: 'id',
                labelField: 'className',
                searchField: 'className',
                selectOnTab: true,
                addPrecedence: true,
                placeholder: "Chọn lớp...",
                create: false,
                maxItems: 1,
                preload: true,
                onDelete: (value, event) => {
                    Swal.fire({
                        title: "Lỗi!",
                        text: "Không được trống!",
                        icon: 'error',
                    })
                    return false;
                },
                onChange: (value) => {
                    initializeScheduleTbl();
                },
                render: {
                    option: function (data, escape) {
                        if (data.id === 0) {
                            return '<div class="option no-results">' + escape(data.className) + '</div>';
                        } else {
                            return '<div class="option">' + escape(data.className) + '</div>';
                        }
                    }
                }
            });
        } else {
            document.getElementById('class-history-select').parentElement.classList.toggle('d-none', true);
        }
    }


    async function getNote(classId, week) {
        try {
            const response = await fetch('/notebook/history/note', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ classId, week })
            });
            if (response && response.status === 200) {
                const res = await response.json();
                if (res.message === 'Found') return res;
                return null
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async function getWeek() {
        try {
            const response = await fetch('/notebook/history/week');
            if (response && response.status === 200) {
                const res = await response.json();
                return res;
            }
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    async function chooseWeekTrackHistory() {
        let result = await getWeek();

        const weeks = {};
        result.week.forEach(row => {
            const week = row.week_of_semester;
            const date = new Date(row.date).toISOString().split('T')[0];
            if (!weeks[week]) {
                weeks[week] = { week, dates: [] };
            }
            weeks[week].dates.push(date);
        });

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            return `${day}/${month}`;
        };

        const weekOptions = Object.values(weeks).map(({ week, dates }) => {
            const startDate = formatDate(dates[0]);
            const endDate = formatDate(dates[dates.length - 1]);
            return {
                id: week,
                week: `Tuần ${week} (${startDate} - ${endDate})`
            };
        });

        const weekSelectInstance = new TomSelect("#week-history-select", {
            options: weekOptions,
            items: result?.currentWeek,
            valueField: 'id',
            labelField: 'week',
            searchField: 'week',
            selectOnTab: true,
            addPrecedence: true,
            placeholder: "Chọn tuần...",
            create: false,
            maxItems: 1,
            preload: true,
            onDelete: (value, event) => {
                Swal.fire({
                    title: "Lỗi!",
                    text: "Không được trống!",
                    icon: 'error',
                })
                return false;
            },
            onChange: (value) => {
                initializeScheduleTbl();
            }
        })
    }

    function takeNote() {
        chooseClassTakeNote();
        formValidation();
        resetFormBtn();
    }

    function trackHistory() {
        chooseClassTrackHistory();
        chooseWeekTrackHistory();
        let historyTab = document.getElementById('history-tab');
        historyTab.addEventListener('click', (btn) => {
            initializeScheduleTbl();
        });

        exportToPDF();
        exportToExcel();
    }
    function exportToPDF() {
        let exportToPDFBtn = document.getElementById('export-pdf-btn');
        if (exportToPDFBtn) {
            exportToPDFBtn.addEventListener('click', () => {
                const element = document.getElementById('schedule-table');
                const opt = {
                    margin:       0.1,
                    filename:     'Notebook Report.pdf',
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  { scale: 2 },
                    jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
                };
                html2pdf().from(element).set(opt).save();
            });
        }
    }
    function exportToExcel() {
        const exportToExcelBtn = document.getElementById('export-excel-btn');
        exportToExcelBtn.addEventListener('click', function () {
            const table = document.getElementById("schedule-table");
            const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });

            // Apply color formatting
            const ws = wb.Sheets["Sheet1"];
            const range = XLSX.utils.decode_range(ws['!ref']);

            // Auto fit columns
            const colWidths = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
                let maxWidth = 10;
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    const cell_address = {c:C, r:R};
                    const cell_ref = XLSX.utils.encode_cell(cell_address);
                    if (ws[cell_ref] && ws[cell_ref].v) {
                        const value = ws[cell_ref].v.toString();
                        maxWidth = Math.max(maxWidth, value.length);
                    }
                }
                colWidths.push({wch: maxWidth});
            }
            ws['!cols'] = colWidths;
            XLSX.writeFile(wb, "Notebook Report.xlsx");
        });
    }
    async function notebookMain() {
        takeNote();
        trackHistory();
    }
    notebookMain();
    
});
