import Swal from "sweetalert2";
import TomSelect from "tom-select";

document.addEventListener("DOMContentLoaded", function () {
  const loadStudents = (scheduleId) => {
    const classId = document.querySelector("#class-select").tomselect?.getValue();

    let endpoint = `/attendance/students`;
    if (classId) {
      endpoint += `?classId=${classId}`;
    }
    if (scheduleId) {
      endpoint += `&scheduleId=${scheduleId}`;
    }

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        data = data.map(item => {
          if (item.is_present === null) {
            item.is_present = 0;
            item.is_permitted = 0;
          } else if (item.is_present === 1) {
            item.is_permitted = 0;
          } else if (item.is_present === -1) {
            item.is_present = 0;
            item.is_permitted = -1;
          }
          return item;
        });

        const table = document.querySelector("#attendance-tbl");
        let dataTable = new DataTable(table, {
          data: data,
          columns: [
            {
              data: "student_id",
              render: function (data, type, row) {
                return `<strong>${data}</strong>`;
              }
            },
            { data: "last_name" },
            { data: "first_name" },
            {
              data: "is_present",
              orderable: false,
              searchable: false,
              render: (data, type, row) => {
                if (type === "display") {
                  return (
                    '<input class="form-check-input is-present-checkbox" type="checkbox" ' +
                    (data === 1 ? "checked" : "") +
                    ">"
                  );
                }
                return data;
              },
            },
            {
              data: "is_permitted",
              orderable: false,
              searchable: false,
              render: (data, type, row) => {
                if (type === 'display') {
                  if (data === -1) {
                    return '<input class="form-check-input is-permitted-checkbox" type="checkbox" checked>';
                  } else if (data === 0 && row.is_present === 0) {
                    return '<input class="form-check-input is-permitted-checkbox" type="checkbox" >';
                  }
                }
                return '<input class="form-check-input is-permitted-checkbox" type="checkbox" disabled>';
              }
            },
            {
              data: "is_present",
              orderable: false,
              searchable: false,
              render: (data, type, row) => {
                if (type === "display") {
                  if (data) {
                    return `<button class="btn btn-primary note-btn d-none btn-sm rounded-2">Ghi chú</button>`;
                  }

                  return (!row.note && row.note?.length === 0) ? `<button class="btn btn-primary note-btn btn-sm rounded-2">Ghi chú</button>` : `<button class="btn btn-warning note-btn btn-sm rounded-2">Ghi chú</button>`;
                }
                return data;
              },
            },
          ],
          columnDefs: [
            {
              className: "text-center",
              targets: "_all"
            },
          ],
          paging: false,
          processing: true,
          responsive: true,
          scrollCollapse: true,
          stateSave: true,
          colReorder: true,
          destroy: true,
          "bLengthChange": false,
          language: {
            url: 'https://cdn.datatables.net/plug-ins/2.0.5/i18n/vi.json',
            info: `<span style="font-size: 14px">Từ _START_ - _END_ </span><strong>/ _MAX_ dòng</strong>`,
            infoEmpty: "Không có dữ liệu",
            infoFiltered: "",
          },
          initComplete: function (settings, json) {
            var api = this.api();
            function handleCheckAll(event) {
              const checkboxes = document.querySelectorAll(".is-present-checkbox");
              const permittedCheckboxes = document.querySelectorAll(".is-permitted-checkbox");
              const isChecked = event.target.checked;

              checkboxes.forEach(checkbox => {
                checkbox.checked = isChecked;
                updateData(checkbox);
              });

              permittedCheckboxes.forEach(checkbox => {
                checkbox.disabled = isChecked;
                checkbox.checked = false;
                updateData(checkbox);
              });

              const $noteButtons = $(".note-btn");
              $noteButtons.toggleClass("d-none", isChecked);

              const students = dataTable.rows().data().toArray();
              if (isChecked) {
                students.forEach(student => {
                  student.note = "";
                });
                dataTable.clear().rows.add(students).draw();
              }
            }

            const $checkAll = $("#check-all");
            $("#check-all").on("change", handleCheckAll);

            const checkedCheckboxes = document.querySelectorAll(".is-present-checkbox:checked");
            const checkboxes = document.querySelectorAll('.is-present-checkbox');
            const isCheckedAll = checkedCheckboxes.length === checkboxes.length;
            $checkAll.prop('checked', isCheckedAll);

            function showToast(message, isError = false) {
              const toastBody = document.querySelector('.toast-body');
              toastBody.innerText = message;
              const toast = new bootstrap.Toast(document.querySelector('.toast'));
              toast.show();
            }

            // Handle confirm
            const confirmButtonEvent = async () => {
              const students = dataTable.rows().data().toArray();
              const createUpdateRecord = (student, scheduleId) => {
                if (student.is_permitted === -1) {
                  student.is_present = -1;
                }

                // Remove is_permitted
                const { is_permitted, ...updatedStudent } = student;

                return {
                  ...updatedStudent,
                  schedule_id: scheduleId,
                  classId: classId
                };
              };

              const upsertRecords = students.map(student => createUpdateRecord(student, scheduleId));

              const upsertAttendance = async (url, records) => {
                try {
                  const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ records })
                  });
                  const data = await response.json();
                  console.log("Upserted records:", data);
                  showToast("Cập nhật điểm danh thành công!");
                } catch (error) {
                  console.error("Error upserting records:", error);
                }
              };

              // Execute fetch operation
              if (upsertRecords.length > 0) {
                await upsertAttendance("/attendance/students", upsertRecords);
              }
            };
            const confirmButton = document.querySelector("#confirm-btn");
            confirmButton.addEventListener("click", confirmButtonEvent);

            const getDataRow = (element) => {
              const row = element.closest("tr");
              const index = dataTable.row(row).index();
              const data = dataTable.row(index).data();
              return data;
            };
            const updateData = (checkbox) => {
              const data = getDataRow(checkbox);
              console.log("===== Before:");
              console.table(data);

              const isPresentCheckbox = checkbox.classList.contains("is-present-checkbox");
              const isPermittedCheckbox = checkbox.classList.contains("is-permitted-checkbox");

              if (isPresentCheckbox) {
                console.log("===== Running: isPresentCheckbox");
                data.is_present = checkbox.checked ? 1 : 0;
              }

              if (isPermittedCheckbox) {
                console.log("===== Running: isPermittedCheckbox");
                //boolean to num
                data.is_permitted = checkbox.checked ? -1 : 0;
              }

              console.log("===== After:");
              console.table(data);
            };

            // Table onclick event 
            function handleTableEvent(e) {
              if (e.target.matches('.note-btn') || e.target.closest('.note-btn')) {
                const data = getDataRow(e.target);
                Swal.fire({
                  input: "textarea",
                  inputLabel: "Lý do vắng",
                  inputPlaceholder: "Ghi lí do vắng ở đây...",
                  inputValue: data.note ? data.note : "",
                  confirmButtonText: "Xác nhận",
                  showCancelButton: true,
                  cancelButtonText: "Hủy",
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      title: "Thành công!",
                      icon: "success",
                      text: "Cập nhật thành công!"
                    })
                    data.note = result.value;
                  }
                });
              } else if (e.target.matches('.is-permitted-checkbox') || e.target.closest('.is-permitted-checkbox')) {
                updateData(e.target);
              } else if (e.target.matches('.is-present-checkbox') || e.target.closest('.is-present-checkbox')) {
                const $checkboxes = $(table).find('.is-present-checkbox');
                const $checkedCheckboxes = $checkboxes.filter(':checked');
                const isCheckedAll = $checkedCheckboxes.length === $checkboxes.length;

                $('#check-all').prop('checked', isCheckedAll);

                const $row = $(e.target).closest('tr');
                const $noteButton = $row.find('.note-btn');
                const $permittedCheckbox = $row.find('.is-permitted-checkbox');
                $permittedCheckbox.prop('disabled', e.target.checked).prop('checked', !e.target.checked);
                if (!e.target.checked) {
                  $permittedCheckbox.prop('checked', false);
                } else {
                  let data = getDataRow(e.target);
                  if (data) {
                    data.note = "";
                  }
                }
                updateData(e.target);
                updateData(e.target.closest('tr').querySelector('.is-permitted-checkbox'));

                $noteButton.toggleClass('d-none');
              }
            }
            table.addEventListener("click", handleTableEvent);
            // Remove the event listener
            dataTable.on('destroy.dt', function (e, settings) {
              $("#check-all").off("change", handleCheckAll);
              confirmButton.removeEventListener("click", confirmButtonEvent);
              table.removeEventListener("click", handleTableEvent);
            });
          }
        });
      });
  };

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
      onInitialize: () => {
        loadStudents(periods[0]?.scheduleId);
      },
      onChange: (value) => {
        periodSelectInstance.blur();
        $('#check-all').prop('checked', false);
        loadStudents(value);
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

  async function chooseClass() {
    const classes = await getClasses();
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
        await choosePeriods(value);
      },
      onItemRemove: (value, item) => {
        $('#content').toggleClass("d-none", true);
        $('#session-select')[0].tomselect.destroy();
        $('#attendance-tbl').DataTable().destroy();
      },
      onChange: (value) => {
        $('#check-all').prop('checked', false);
      },
      render: {
        option: function(data, escape) {
          if (data.id === 0) {
            return '<div class="option no-results">' + escape(data.className) + '</div>';
          } else {
            return '<div class="option">' + escape(data.className) + '</div>';
          }
        }
      }
    });
  }

  async function getClasses() {
    try {
      const response = await fetch('/attendance/classes');
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
      const response = await fetch(`/attendance/periods/${classId}`);
      if (response && response.status === 200) {
        const res = await response.json();
        return res;
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async function attendanceMain() {
    chooseClass();
  }
  attendanceMain();
});
