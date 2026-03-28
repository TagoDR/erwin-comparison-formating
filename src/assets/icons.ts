import { html } from "lit";
import { unsafeSVG } from "lit/directives/unsafe-svg.js";
import IconClipboardCopy from "./icons/clipboard-copy.svg";
import IconClipboardList from "./icons/clipboard-list.svg";
import IconCopy from "./icons/copy.svg";
import IconFileDiff from "./icons/file-diff.svg";
import IconFileUpload from "./icons/file-upload.svg";
import IconFilter from "./icons/filter.svg";
import IconFilterOff from "./icons/filter-off.svg";
import IconX from "./icons/x.svg";

export const icons = {
	"clipboard-copy": html`${unsafeSVG(IconClipboardCopy)}`,
	"clipboard-list": html`${unsafeSVG(IconClipboardList)}`,
	copy: html`${unsafeSVG(IconCopy)}`,
	"file-diff": html`${unsafeSVG(IconFileDiff)}`,
	"file-upload": html`${unsafeSVG(IconFileUpload)}`,
	"filter-off": html`${unsafeSVG(IconFilterOff)}`,
	filter: html`${unsafeSVG(IconFilter)}`,
	x: html`${unsafeSVG(IconX)}`,
};
