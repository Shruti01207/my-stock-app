
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Controller } from 'react-hook-form'

const SelectField = ({
  name, label, placeholder, options, control, error,
  required = false }: SelectFieldProps
) => {
  return (
    <div className='space-y-2'>

      <label htmlFor={name} className='form-label'
      >{label}</label>

      <Controller name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false
        }}

        render={({ field }) => {
          return (
            <Select value={field.value} onValueChange={field.onChange} >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className='bg-gray-800 border-gray-600 text-white'>
                {
                  options.map((option) => {
                    return (
                      <SelectItem value={option.value} key={option.value} className='focus:bg-ray-600 focus:text-white'>{option.label}</SelectItem>
                    )
                  })
                }
              </SelectContent>

              {error && <p className='text-red-500'>{error.message}</p>}
            </Select>
          )
        }

        }


      />



    </div>
  )
}

export default SelectField