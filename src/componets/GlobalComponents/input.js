import React from 'react'

const Input = ({ onChange = function () { }, type, value, name, onClick, placeholder }) => (
    <input
        type={type || ''}
        className='customInput'
        onChange={(e) => onChange(e)}
        value={value}
        name={name}
        onClick={() => onClick()}
        placeholder={placeholder}
    />
)
export default Input