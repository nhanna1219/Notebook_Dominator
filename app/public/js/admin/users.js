const Swal = require('sweetalert2');

$(function () {
	function attachRoleActions() {
		$('#role-tbl').on('click', '.edit-btn', function (e) {
			e.preventDefault();
			editRole(this);
		});

		// Handle update action
		$('#role-tbl').on('click', '.update-btn', async function (e) {
			e.preventDefault();
			updateRole(this);
		});

		$('#role-tbl').on('click', '.cancel-btn', function (e) {
			e.preventDefault();
			cancelUpdateRole(this);
		});
		// Handle delete action
		$('#role-tbl').on('click', '.del-btn', async function (e) {
			e.preventDefault();
			deleteRole(this);
		});
	}

	function createRole() {
		let createRoleBtn = $(".create-role-btn");
		if (createRoleBtn) {
			createRoleBtn.on('click', (e) => {
				e.preventDefault();
				let content = `
				<input id="roleInput" type="text" class="swal2-input" placeholder="Nhập vai trò">
			`;
				Swal.fire({
					title: "Tạo mới vai trò",
					html: content,
					showCancelButton: true,
					cancelButtonText: 'Hủy',
					preConfirm: () => {
						const inputValue = document.getElementById('roleInput').value.trim();

						if (inputValue.length < 3) {
							Swal.showValidationMessage('Tên vai trò phải có ít nhất 3 ký tự.');
							return false;
						}
						const acronym = inputValue.split(/\s+/).filter(Boolean).map(word => word[0].toUpperCase()).join('');
						return { name: inputValue, shortName: acronym };
					}
				}).then(async (result) => {
					if (result.isConfirmed) {
						let body = {
							name: result.value.name,
							short_name: result.value.shortName
						};
						try {
							const response = await fetch('/role', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(body)
							});

							if (response && response.status === 201) {
								let newRole = await response.json();
								let newRoleHtml = `
								<tr>
									<td>
										${newRole.id}
									</td>
									<td>
										<span class="role-name">${newRole.name}</span>
										<input type="text" class="input-group my-2 text-center rounded role-name-input d-none" value="${newRole.name}">                
									</td>
									<td>
										<span class="badge rounded-pill bg-success">Active</span>
										<select class="form-select status-select form-select-sm my-2 d-none" aria-label="Chọn Trạng Thái">
											<option value="1">Active</option>
											<option value="-1">Inactive</option>
										</select>
									</td>
									<td>
										<a href="#" class="btn btn-sm edit-btn mx-3"><i class="ti ti-pencil-alt"></i></a>
										<a href="#" class="btn btn-sm del-btn btn-danger"><i class="ti ti-trash"></i></a>
										<a href="#" class="btn btn-sm update-btn btn-primary mt-2 d-none mx-3"><i class="ti ti-check"></i></a>
										<a href="#" class="btn btn-sm cancel-btn btn-secondary mt-2 d-none"><i class="ti ti-close"></i></a>
									</td>
								</tr>
								`;

								const roleBody = document.querySelector('#role-tbl tbody');
								if (roleBody) {
									roleBody.insertAdjacentHTML('beforeend', newRoleHtml);
								}
								Swal.fire({
									html: '<strong>Thêm thành công!</strong>',
									icon: 'success'
								});
							} else if (response && response.status === 409) {
								Swal.fire({
									title: "Thất bại",
									html: 'Vai trò đã tồn tại, vui lòng nhập tên vai trò khác',
									icon: 'error'
								});
							} else {
								console.log(response);
								Swal.fire({
									title: "Thất bại",
									html: 'Đã xảy ra lỗi trong quá trình xử lý, vui lòng thử lại sau...',
									icon: 'error'
								});
							}
						} catch (e) {
							console.error(e);
							Swal.fire({
								title: "Thất bại",
								html: 'Đã xảy ra lỗi trong quá trình xử lý, vui lòng thử lại sau...',
								icon: 'error'
							});
						}
					}
				});
			})
		}
	}

	function editRole(btn) {
		const closestTr = btn.closest('tr');
		const nameInput = closestTr.querySelector('.role-name-input');
		const statusSelect = closestTr.querySelector('.status-select');
		const updateBtn = closestTr.querySelector('.update-btn');
		const cancelBtn = closestTr.querySelector('.cancel-btn');
		if (nameInput && statusSelect && updateBtn && cancelBtn) {
			nameInput.classList.remove('d-none');
			statusSelect.classList.remove('d-none');

			const roleName = nameInput.parentElement.querySelector('.role-name');
			roleName.classList.add('d-none');

			const status = statusSelect.parentElement.querySelector('span');
			let currentStatus = status.innerText;
			status.classList.add('d-none');

			statusSelect.value = currentStatus === "Active" ? '1' : '-1';

			updateBtn.classList.remove('d-none');
			cancelBtn.classList.remove('d-none');
		}
		btn.classList.add('d-none');
		btn.nextElementSibling.classList.add('d-none');
	}

	async function updateRole(btn) {
		const closestTr = btn.closest('tr');
		const nameInput = closestTr.querySelector('.role-name-input');
		const roleSelect = closestTr.querySelector('.status-select');
		if (nameInput && roleSelect) {
			let roleName = nameInput.value;
			let roleStatus = roleSelect.value;
			if (!roleName || !roleStatus) {
				Swal.fire({
					title: "Lỗi",
					text: "Hãy nhập đủ thông tin để thực hiện cập nhật",
					icon: "error"
				});
				return;
			}

			const idCell = closestTr.querySelector('td');
			const id = idCell.textContent.trim();
			const shortName = roleName.split(/\s+/).filter(Boolean).map(word => word[0].toUpperCase()).join('');
			let body = {
				name: roleName,
				is_active: roleStatus,
				short_name: shortName
			}
			const response = await fetch(`/role/${id}`, {
				method: "PUT",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			})

			if (response && response.status === 200) {

				let updatedRole = await response.json();

				nameInput.classList.add('d-none');
				roleSelect.classList.add('d-none');

				const roleName = nameInput.parentElement.querySelector('.role-name');
				roleName.innerText = updatedRole.name;
				roleName.classList.remove('d-none');

				let statusHtml = ``;
				switch (updatedRole.is_active) {
					case "1":
						statusHtml = '<span class="badge rounded-pill bg-success">Active</span>'
						break;
					case "-1":
						statusHtml = '<span class="badge rounded-pill bg-secondary">Inactive</span>'
						break;
					default:
						statusHtml = '<span class="badge rounded-pill bg-info text-dark">Unknown</span>'
						break;
				};
				let parentRoleSelect = roleSelect.parentElement;
				let oldStatus = parentRoleSelect.querySelector('span.badge');
				oldStatus.remove();
				roleSelect.insertAdjacentHTML('afterend', statusHtml);

				btn.classList.add("d-none");

				let parentAction = btn.parentElement;
				const editBtn = parentAction.querySelector('.edit-btn');
				const deleteBtn = parentAction.querySelector('.del-btn');
				editBtn.classList.remove('d-none');
				deleteBtn.classList.remove('d-none');

				const cancelBtn = closestTr.querySelector('.cancel-btn');
				cancelBtn.classList.add('d-none');

				Swal.fire({
					html: '<strong>Cập nhật thành công!</strong>',
					icon: 'success'
				});
			} else if (response && response.status === 409) {
				Swal.fire({
					title: "Thất bại",
					html: 'Vai trò đã tồn tại, vui lòng nhập tên vai trò khác',
					icon: 'error'
				});
			} else {
				Swal.fire({
					title: "Lỗi!",
					icon: "error",
					text: "Lỗi cập nhật vai trò, vui lòng thử lại sau",
				})
			}
		}

	}

	function cancelUpdateRole(btn) {
		let closestTr = btn.closest('tr');

		const editBtn = closestTr.querySelector('.edit-btn');
		const deleteBtn = closestTr.querySelector('.del-btn');
		const updateBtn = closestTr.querySelector('.update-btn');

		const roleInput = closestTr.querySelector('.role-name-input');
		const role = closestTr.querySelector('.role-name');
		const statusSelect = closestTr.querySelector('.status-select');
		const status = closestTr.querySelector('.badge');
		if (editBtn && deleteBtn && updateBtn) {
			editBtn.classList.toggle('d-none', false);
			deleteBtn.classList.toggle('d-none', false);
			updateBtn.classList.toggle('d-none', true);
			btn.classList.toggle('d-none', true);

			roleInput.classList.toggle('d-none', true);
			statusSelect.classList.toggle('d-none', true);
			role.classList.toggle('d-none', false);
			status.classList.toggle('d-none', false);
		}
	}

	function deleteRole(btn) {
		const closestTr = btn.closest('tr');
		const roleName = closestTr.querySelector('.role-name').textContent;
		Swal.fire({
			title: "Cảnh báo!",
			icon: "warning",
			html: `Bạn có muốn xóa vai trò <strong>${roleName}</strong> không?`,
			showCancelButton: true,
			confirmButtonText: "Xóa",
			cancelButtonText: "Không",
			preConfirm: async () => {
				const idCell = closestTr.querySelector('td');
				const id = idCell.textContent.trim();

				const response = await fetch(`/role/${id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (response && response.status === 204) {
					closestTr.remove();

					Swal.fire({
						html: '<strong>Xóa thành công!</strong>',
						icon: 'success'
					});
				} else {
					Swal.fire({
						title: "Lỗi!",
						icon: "error",
						text: "Lỗi xóa vai trò, vui lòng thử lại sau",
					})
				}
			}
		})
	}

	function initializeUsersTbl() {
		const userTable = new DataTable('#user-tbl', {
			ajax: '/role/users',
			columns: [
				{ title: "ID", data: "id" },
				{ title: "Họ", data: "last_name" },
				{ title: "Tên", data: "first_name" },
				{ title: "Email", data: "email" },
				{
					title: "Trạng thái",
					data: "is_active",
					render: function (data, type, row) {
						let statusClass = '';
						let status = '';
						switch (data) {
							case 1:
								statusClass = 'bg-success';
								status = 'Active';
								break;
							case 0:
								statusClass = 'bg-secondary';
								status = 'Inactive'
								break;
							default:
								statusClass = 'bg-info';
						}
						return `<span class="badge rounded-pill ${statusClass}">${status}</span>`;
					}
				},
				{
					title: "Tên đăng nhập",
					data: "username",

				},
				{
					title: "Vai trò",
					data: "role_name"
				},
				{
					title: "Phụ trách môn",
					data: "subject_name",
					render: function(data, type, row) {
						return data ? data : 'Không phụ trách';
					}
				},
				{
					title: "Hành động",
					data: null,
					defaultContent: '<button id="edit-user-btn" type="button" data-toggle="modal" data-target="#edit-user-modal" class="btn btn-sm edit-btn mx-3"><i class="ti ti-pencil-alt"></i></button><button id="delete-task-btn" class="btn btn-sm del-btn btn-danger"><i class="ti ti-trash"></i></button>',
					orderable: false,
				},
			],
			columnDefs: [
				{ className: "dt-head-center", targets: '_all' },
				{ className: "dt-body-center", targets: [0, 7] }
			],
			paging: true,
			responsive: true,
			scrollCollapse: true,
			stateSave: true,
			colReorder: true,
			bDestroy: true,
			lengthMenu: [5, 10, 20, 50],
			pageLength: 5,
			language: {
				url: 'https://cdn.datatables.net/plug-ins/2.0.5/i18n/vi.json',
				info: `<span style="font-size: 14px">Từ _START_ - _END_ </span><strong>/ _MAX_ dòng</strong>`,
				infoEmpty: "Không có dữ liệu",
				infoFiltered: "",
				lengthMenu: "Hiển thị _MENU_ dòng",
			},
			initComplete: function () {
				var api = this.api();

				// Edit button
				$('#user-tbl tbody').on('click', 'button.edit-btn', function () {
					var data = api.row($(this).parents('tr')).data();
					handleEditUser(data);
				});

				// Delete button
				$('#user-tbl tbody').on('click', 'button.del-btn', function () {
					var row = api.row($(this).parents('tr'));
					var data = row.data();
					console.log('Delete button clicked for user ID:', data.id);

					handleDeleteUser(data, row);
				});

				// Add User
				const addUserModal = document.getElementById('add-user-modal');
				if (addUserModal) {
					function modalShownHandler() {
						addUser(addUserModal, userTable);

						// On Role Select Change
						$('#add-user-modal #userRole').change(userSelectHandle('#add-user-modal'));
					}
					addUserModal.addEventListener('shown.bs.modal', modalShownHandler);
					addUserModal.addEventListener('hidden.bs.modal', function () {
						const userInfoForm = document.getElementById('user-info');
						if (userInfoForm) {
							userInfoForm.reset();
						}
						$('#userSubject').closest('.form-group').show();
						$('#userRole').off(userSelectHandle);
						addUserModal.removeEventListener('shown.bs.modal', modalShownHandler);
					});
				}
			}
		});
	}
	function userSelectHandle(parentId) {
		return function () {
			let roleName = $(`${parentId} #userRole option:selected`).text().trim();
			if (roleName === "Ban Giám Hiệu") {
				$(`${parentId} #userSubject`).closest('.form-group').hide();
			} else {
				$(`${parentId} #userSubject`).closest('.form-group').show();
			}
		}
	}

	function handleEditUser(data) {
		const clonedModal = $('#add-user-modal').clone();
		clonedModal.attr('id', 'edit-user-modal');

		$('body').append(clonedModal);

		const editUserForm = clonedModal.find('#user-info');
		editUserForm[0].reset();

		// Populate data
		clonedModal.find('#userLastName').val(data.last_name);
		clonedModal.find('#userFirstName').val(data.first_name);

		clonedModal.find("#userRole option").filter(function () {
			return $(this).text().trim() == data.role_name;
		}).prop('selected', true);

		if (data.role_name === "Ban Giám Hiệu") {
			$('#edit-user-modal #userSubject').closest('.form-group').hide();
		} else {
			clonedModal.find("#userSubject option").filter(function () {
				return $(this).text().trim() == data.subject_name;
			}).prop('selected', true);
		}

		clonedModal.find('#userEmail').val(data.email);
		clonedModal.find('#username').val(data.username);
		
		// On Role Select Change
		$('#edit-user-modal #userRole').change(userSelectHandle('#edit-user-modal'));

		$('#edit-user-modal').modal('show');
		$('#edit-user-modal').on('hidden.bs.modal', function () {
			$(this).remove();
		});

		// Save edit form
		$('#edit-user-modal .add-user-btn').removeClass('add-user-btn').addClass('edit-user-btn').text('Cập nhật');
		$('#edit-user-modal .edit-user-btn').on('click', async function () {
			const isValid = validateForm('#edit-user-modal');
			if (isValid) {
				let content = getFormValues('#edit-user-modal');
				const response = await fetch(`/role/users/${data.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(content)
				});
				if (response.status === 200) {
					let user = await response.json();
					$('#user-tbl').DataTable().ajax.reload(null, false);

					$('#edit-user-modal').modal('hide');
					Swal.fire({
						title: "Thành công!",
						icon: "success",
						html: `Chỉnh sửa người dùng <strong>${content.lastName + " " + content.firstName}</strong> thành công.`
					})

				} else if (response.status === 409) {
					let res = await response.json();
					Swal.fire({
						title: "Lỗi!",
						icon: "error",
						text: res.message === 'Username already exists' ? 'Tên đăng nhập đã tồn tại, vui lòng chọn tên đăng nhập khác' : 'Email đã tồn tại, vui lòng chọn email khác',
					})
				} else {
					Swal.fire({
						title: "Lỗi!",
						icon: "error",
						text: "Lỗi chỉnh sửa người dùng, vui lòng thử lại sau",
					})
				}
			}
		});
	}

	function handleDeleteUser(data, row) {
		Swal.fire({
			title: `Cảnh báo`,
			icon: 'warning',
			html: `Bạn có chắc muốn xóa người dùng <strong>${data.last_name} ${data.first_name}</strong> không?`,
			confirmButtonText: "Xóa",
			showCancelButton: "Hủy",
			preConfirm: async () => {
				const response = await fetch(`/role/users/${data.id}`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				if (response && response.status === 204) {
					row.remove().draw();

					Swal.fire({
						html: '<strong>Xóa thành công!</strong>',
						icon: 'success'
					});
				} else {
					Swal.fire({
						title: "Lỗi!",
						icon: "error",
						text: "Lỗi xóa người dùng, vui lòng thử lại sau",
					})
				}
			}
		})
	}

	function addUser(modal) {
		modal.addEventListener('click', async function (e) {
			if (e.target.matches('.add-user-btn') || e.target.closest('.add-user-btn')) {
				let isValid = validateForm('#add-user-modal');
				if (isValid) {
					Swal.fire({
						title: "Đang xử lý!",
						text: "Vui lòng đợi trong khi hệ thống xử lý",
						icon: "info",
						showConfirmButton: false,
						willOpen: async () => {
							Swal.showLoading();

							let content = getFormValues('#add-user-modal');
							const response = await fetch('/role/users', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(content)
							});
							if (response.status === 201) {
								let user = await response.json();
								$('#user-tbl').DataTable().ajax.reload();
								$('#add-user-modal').modal('hide');
								Swal.fire({
									title: "Thành công!",
									icon: "success",
									html: `Thêm người dùng <strong>${content.lastName + " " + content.firstName}</strong> thành công.`
								})
							} else if (response.status === 409) {
								let res = await response.json();
								Swal.fire({
									title: "Lỗi!",
									icon: "error",
									text: res.message === 'Username already exists' ? 'Tên đăng nhập đã tồn tại, vui lòng chọn tên đăng nhập khác' : 'Email đã tồn tại, vui lòng chọn email khác',
								})
							} else {
								Swal.fire({
									title: "Lỗi!",
									icon: "error",
									text: "Lỗi thêm người dùng, vui lòng thử lại sau",
								})
							}
						}
					})
				}
			}
		});
	}

	function showAlert(message) {
		var alertDiv = $('#validationAlert');
		var messageDiv = $('#errorMsg');

		messageDiv.text(message);
		alertDiv.removeClass('d-none');

		setTimeout(function () {
			alertDiv.fadeOut('fast', function () {
				alertDiv.addClass('d-none').removeAttr('style');
			});
		}, 3000);
	}

	function validateForm(parentElement) {
		// Validate Last Name
		if ($(`${parentElement} #userLastName`).val().trim() === '') {
			showAlert('Chưa nhập họ tên người dùng, vui lòng kiểm tra lại!');
			return false;
		}

		// Validate First Name
		if ($(`${parentElement} #userFirstName`).val().trim() === '') {
			showAlert('Chưa nhập họ tên người dùng, vui lòng kiểm tra lại!');
			return false;
		}

		// Validate Email
		if ($(`${parentElement} #userEmail`).val().trim() === '') {
			showAlert('Vui lòng nhập email để tạo người dùng!');
			return false;
		} else {
			// Simple email pattern check
			var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailPattern.test($(`${parentElement} #userEmail`).val().trim())) {
				showAlert('Vui lòng nhập đúng định dạng email!');
				return false;
			}
		}

		// Validate Username
		if ($(`${parentElement} #username`).val().trim() === '') {
			showAlert('Vui lòng nhập username!');
			return false;
		}
		return true;
	}

	// Function to get form values
	function getFormValues(parentElement) {
		var roleName = $('#userRole option:selected').text().trim(); 
		return {
			lastName: $(`${parentElement} #userLastName`).val().trim(),
			firstName: $(`${parentElement} #userFirstName`).val().trim(),
			email: $(`${parentElement} #userEmail`).val().trim(),
			username: $(`${parentElement} #username`).val().trim(),
			role: $(`${parentElement} #userRole`).val(),
			subject: roleName !== 'Ban Giám Hiệu' ? $(`${parentElement} #userSubject`).val() : null
		};
	}

	function main() {
		// Role
		createRole();
		attachRoleActions();

		// User
		initializeUsersTbl();
	}
	main();
});