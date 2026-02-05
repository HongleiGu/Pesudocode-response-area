type SectionProps = {
  title: string
  children: React.ReactNode
}

export const Section = ({ title, children }: SectionProps) => (
  <fieldset className="evalParamsSection">
    <legend>{title}</legend>
    {children}
  </fieldset>
)

export const Checkbox = ({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) => (
  <label className="eval-params__row">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label}
  </label>
)

export const Slider = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) => (
  <label className="eval-params__row">
    {label}
    <input
      type="range"
      min={0}
      max={1}
      step={0.05}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
    <span>{value.toFixed(2)}</span>
  </label>
)

export const Select = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: any) => void
}) => (
  <label className="eval-params__row">
    {label}
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </label>
)
