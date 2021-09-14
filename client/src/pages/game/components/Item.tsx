import React from 'react'

interface ItemProps {
    name: string
    imageSrc: string
    description: string
}

export const Item: React.FC<ItemProps> = ({name, imageSrc, description}) => {

    const shouldRenderDesc = description !== name && description !== 'short description is not available'

    return (
        <div>
            <img alt={name} src={imageSrc} style={{maxWidth: '50%', height: 'auto'}} />
            <div style={{marginBottom: 20}}>
                {name}
            </div>
            {shouldRenderDesc && (
                <div style={{marginBottom: 20}}>
                    {description}
                </div>
            )}
        </div>
    )
}
