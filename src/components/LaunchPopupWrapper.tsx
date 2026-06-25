import LaunchPopup from './LaunchPopup';

export default function LaunchPopupWrapper({
onClose,
}: {
onClose: () => void;
}) {
return (
<div
onClick={(e) => {
const target = e.target as HTMLElement;

```
    if (
      target.closest('button')
    ) {
      setTimeout(() => {
        onClose();
      }, 500);
    }
  }}
>
  <LaunchPopup />
</div>
```

);
}
