import { Metadata } from '@/lib/types/metadata'
import React from 'react'
import Avvvatars from 'avvvatars-react'
import randiman from '@/components/avaaatars/lib/random'
import { BACKGROUND_COLORS } from '@/lib/emojiAvatarForAddress'

type ProfileViewProps = {
    metadata: Metadata
}

const ProfileView = ({
    metadata,
    children
}: React.HTMLAttributes<HTMLDivElement> & ProfileViewProps) => {
    const key = randiman({ value: metadata.name, min: 0, max: 19 });

    return (
        <div className='w-full sm:h-full min-h-28 transition-all p-2 sm:p-4 rounded-b-2xl md:rounded-b-none'
            style={{ backgroundColor: `#${BACKGROUND_COLORS[key]}4D` }}
        >

            <div className="relative flex flex-col w-full h-full">
                <div className="space-y-3">
                    <div className='flex items-center '>
                        <div className="flex items-center p-0.5 bg-white rounded-[8px] justify-center mr-2">
                            <Avvvatars value={metadata.name} size={50} radius={6} style="shape" />
                        </div>
                        <div>
                            <h2 className='text-lg font-semibold'>{metadata.name}</h2>
                        </div>
                    </div>
                    <div>
                        <h4 className='text-sm font-normal text-muted-foreground'>{metadata.description}</h4>
                    </div>
                </div>
                {
                    children
                }
            </div>
        </div>
    )
}

export default ProfileView