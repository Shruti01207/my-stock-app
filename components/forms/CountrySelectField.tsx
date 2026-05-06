
import React from 'react'
import { Controller } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CountrySelectField = ({
  name, label, placeholder, options, control, error,
  required = false }: SelectFieldProps) => {
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
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className='bg-gray-800 border-gray-600 text-white'>
                {
                  options.map((option) => {
                    return (
                      <SelectItem value={option.value} key={option.value} className='focus:bg-ray-600 focus:text-white'>
                        <div className="flex items-center gap-2">
                          <img
                            src={option.flag}           // e.g. "/flags/us.png" or a URL
                            alt={`${option.label} flag`}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
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

export default CountrySelectField