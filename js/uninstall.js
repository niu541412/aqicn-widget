
window.onload = function() {
    document.getElementById("uninstall").href = 'javascript:void(0);';
    document.getElementById("uninstall").onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();

        chrome.runtime.sendMessage({
            uninstall: true
        });

        return false;
    }
}