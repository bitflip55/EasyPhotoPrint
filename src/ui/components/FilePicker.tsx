interface FilePickerProps {
  onRequestSelect: () => void;
}

export function FilePicker({ onRequestSelect }: FilePickerProps) {
  return (
    <button className="button button--primary" type="button" onClick={onRequestSelect}>
      Bilder hinzufügen
    </button>
  );
}
