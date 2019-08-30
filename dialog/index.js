class Dialog {
    constructor({ width, height, title }) {
        this.width = width || 400;
        this.height = height || 500;
        this.title = title || 'test';
        this.$dialog = null;
        this._openDialog();
    }

    _getDialog() {
        const $dialog = document.getElementById('fePrivateDialog');
        return $dialog;
    }

    _openDialog() {
        let $dialog = this._getDialog();
        if (!$dialog) {
            $dialog = document.createElement('div');
            $dialog.id = 'fePrivateDialog';

            const $title = document.createElement('div');
            const $titleContent = document.createElement('p');
            $titleContent.innerText = this.title;
            $titleContent.style = "margin:0;padding:0;padding-right:30px;text-align:center; position:relative"
            const $close = document.createElement('span');
            $close.innerText = 'x';
            $close.style = "position:absolute;top:50%;right:10px;transform:translateY(-50%);cursor:pointer;padding:0 10px"
            $dialog.appendChild($title);
            $title.appendChild($titleContent);
            $titleContent.appendChild($close);
            document.body.appendChild($dialog);

            this._initEvent($dialog, $close);
        }
        this.$dialog = $dialog;
        $dialog.style = "position:fixed;display:none;border:1px solid #e5e5e5; border-radius:4px";
        $dialog.draggable = true;
        $dialog.style.width = this.width + "px";
        $dialog.style.height = this.height + "px";
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        this.top = (clientHeight - this.height) / 2;
        this.left = (clientWidth - this.width) / 2;


        $dialog.style.top = this.top + "px";
        $dialog.style.left = this.left + "px";

    }

    _initEvent($dialog, $close) {
        $dialog.addEventListener('dragend', (event) => {
            const { offsetX, offsetY } = event || {};
            const diffX = offsetX - this._offsetX;
            const diffY = offsetY - this._offsetY;

            $dialog.style.top = this.top + diffY + 'px';
            $dialog.style.left = this.left + diffX + 'px';
            this.top = this.top + diffY;
            this.left = this.left + diffX;
        });
        $dialog.addEventListener('dragstart', (event) => {
            const { offsetX, offsetY } = event || {};
            this._offsetX = offsetX;
            this._offsetY = offsetY;
        });
        $close.addEventListener('click', () => {
            if (this.$dialog) {
                this.$dialog.style.display = 'none';
                this._initData();
            }
        })

    }
    _initData() {
        const clientWidth = document.body.clientWidth;
        const clientHeight = document.body.clientHeight;
        this.top = (clientHeight - this.height) / 2;
        this.left = (clientWidth - this.width) / 2;
        this.diffX = 0;
        this.diffY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
    }

    showDialog() {
        if (this.$dialog) {
            this.$dialog.style.display = 'block';
        }
    }

}