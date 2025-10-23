// File: js/modals.js

export function setupEventRegisterButton() {
    const eventRegisterButton = document.querySelector('.register-event-button');
    const eventRegisterModal = document.getElementById('event-register-modal');

    if (eventRegisterButton && eventRegisterModal) {
        eventRegisterButton.addEventListener('click', () => {
            eventRegisterModal.classList.add('is-visible');
        });
    }
}

// 4. Xử lý Logic Modal Đăng nhập, Đề xuất
export function setupModal() {
    // Logic đăng nhập
    const modal = document.getElementById('login-modal');
    const loginButton = document.querySelector('.login-button');
    const closeButton = modal ? modal.querySelector('.close-button') : null;
    const loginForm = document.querySelector('.login-form');

    if (modal && loginButton && closeButton && loginForm) {
        // Mở
        loginButton.addEventListener('click', () => { modal.classList.add('is-visible'); });

        // Đóng 
        closeButton.addEventListener('click', () => { modal.classList.remove('is-visible'); });

        // Đóng (Click ra ngoài)
        modal.addEventListener('click', (event) => {
            if (event.target === modal) { modal.classList.remove('is-visible'); }
        });

        // Xử lý Submit Login (Demo)
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = loginForm.elements.username.value;
            const password = loginForm.elements.password.value;

            // Giả định hàm handleLogin tồn tại
            if (typeof handleLogin === 'function') {
                const result = await handleLogin(username, password);
                if (result.success) {
                    alert('Đăng nhập thành công!');
                    modal.classList.remove('is-visible');
                } else {
                    alert(`Đăng nhập thất bại: ${result.message || 'Sai tên đăng nhập hoặc mật khẩu.'}`);
                }
            } else {
                alert('Đăng nhập thành công! (Demo)');
                modal.classList.remove('is-visible');
            }
        });
    }

    // Logic đề xuất
    const proposalModal = document.getElementById('proposal-modal');
    const proposalButton = document.querySelector('.top-admin-controls button:nth-child(4)');
    const proposalCloseButton = proposalModal ? proposalModal.querySelector('.proposal-close-button') : null;
    const proposalForm = document.querySelector('.proposal-form');

    if (proposalModal && proposalButton && proposalCloseButton && proposalForm) {
        // Mở
        proposalButton.addEventListener('click', () => { proposalModal.classList.add('is-visible'); });

        // Đóng (Nút X)
        proposalCloseButton.addEventListener('click', () => { proposalModal.classList.remove('is-visible'); });

        // Đóng (Click ra ngoài)
        proposalModal.addEventListener('click', (event) => {
            if (event.target === proposalModal) { proposalModal.classList.remove('is-visible'); }
        });

        // Xử lý Submit Đề xuất (Demo)
        proposalForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Đề xuất của bạn đã được gửi thành công! (Demo)');
            proposalModal.classList.remove('is-visible');
            proposalForm.reset();
        });
    }

    // Logic đăng ký sự kiện
    const eventRegisterModal = document.getElementById('event-register-modal');
    const eventRegisterCloseButtons = eventRegisterModal ? eventRegisterModal.querySelectorAll('.event-register-close-button') : [];
    const eventRegisterForm = document.querySelector('.event-register-form');

    if (eventRegisterModal && eventRegisterForm) {
        // Đóng 
        eventRegisterCloseButtons.forEach(button => {
            button.addEventListener('click', () => { eventRegisterModal.classList.remove('is-visible'); });
        });

        // Đóng (Click ra ngoài)
        eventRegisterModal.addEventListener('click', (event) => {
            if (event.target === eventRegisterModal) { eventRegisterModal.classList.remove('is-visible'); }
        });

        // Xử lý Submit Sự kiện (Demo)
        eventRegisterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Yêu cầu thêm sự kiện/đăng ký thông báo đã được gửi thành công! (Demo)');
            eventRegisterModal.classList.remove('is-visible');
            eventRegisterForm.reset();
        });
    }

    // Logic thêm, sửa, xóa
    // Lấy các nút Admin
    const addMemberButton = document.querySelector('.top-admin-controls button:nth-child(1)');
    const editMemberButton = document.querySelector('.top-admin-controls button:nth-child(2)');
    const deleteMemberButton = document.querySelector('.top-admin-controls button:nth-child(3)');

    // Lấy các Modal
    const addMemberModal = document.getElementById('add-member-modal');
    const editMemberModal = document.getElementById('edit-member-modal');
    const deleteMemberModal = document.getElementById('delete-member-modal');

    // Mảng chứa các modal và nút tương ứng
    const adminControls = [
        { button: addMemberButton, modal: addMemberModal, closeClass: '.add-close-button', form: document.getElementById('add-member-form') },
        { button: editMemberButton, modal: editMemberModal, closeClass: '.edit-close-button', form: document.getElementById('edit-member-form') },
        { button: deleteMemberButton, modal: deleteMemberModal, closeClass: '.delete-close-button', form: document.getElementById('delete-member-form') }
    ];

    adminControls.forEach(control => {
        const { button, modal, closeClass, form } = control;

        if (button && modal) {
            // 1. Mở Modal
            button.addEventListener('click', () => {
                modal.classList.add('is-visible');
            });

            // 2. Đóng (Nút X hoặc Hủy bỏ)
            const closeButtons = modal.querySelectorAll(closeClass);
            closeButtons.forEach(closeBtn => {
                closeBtn.addEventListener('click', () => {
                    modal.classList.remove('is-visible');
                    if (form) form.reset();
                });
            });

            // 3. Đóng (Click ra ngoài overlay)
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.classList.remove('is-visible');
                    if (form) form.reset();
                }
            });

            // 4. Logic xử lý Submit Form (Demo)
            if (form) {
                form.addEventListener('submit', (event) => {
                    event.preventDefault();

                    let actionName = '';
                    if (form.id === 'add-member-form') actionName = 'Thêm';
                    else if (form.id === 'edit-member-form') actionName = 'Sửa';
                    else if (form.id === 'delete-member-form') actionName = 'Xóa';

                    alert(`Yêu cầu ${actionName} đã được gửi thành công! (Demo)`);
                    modal.classList.remove('is-visible');
                    form.reset();
                });
            }
        }
    });
}