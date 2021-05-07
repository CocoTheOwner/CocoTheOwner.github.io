export default function InputBox() {
    return (
        <div>
            <input id="f_input" type="file" accept=".csv"/>
            <script type="module" src="../backend/fileInput.js"></script>
        </div>
    )
}