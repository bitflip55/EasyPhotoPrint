interface FilePickerProps {
  onRequestSelect: () => void;
}

export function FilePicker({ onRequestSelect }: FilePickerProps) {
  return (
    <button
      className="button button--primary button--full"
      type="button"
      onClick={onRequestSelect}
    >
      Add images
    </button>
  );
}
