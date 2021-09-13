import React from 'react'

interface ItemProps {
    name: string
    price: string
    imageSrc: string
}

export const Item: React.FC<ItemProps> = ({price, name, imageSrc}) => {
    return (
        <div>
            <img alt={name} src={imageSrc} style={{maxWidth: '50%', height: 'auto'}} />
            <div>
                {name}
            </div>
        </div>
    )
}
