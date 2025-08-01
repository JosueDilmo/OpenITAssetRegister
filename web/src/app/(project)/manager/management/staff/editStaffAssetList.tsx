'use client'
import { BoxField, BoxRoot } from '@/app/components/box'
import { deleteAssetById, getAssetByStaffEmail } from '@/http/api'
import * as Icons from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface EditStaffAssetListProps {
  email: string
  userEmail: string
  userRole: string
}

interface AssetProps {
  success: boolean
  message: string
  assetList: {
    id: string
    serialNumber: string
    name: string
    email: string | null
  }[]
}

export function EditStaffAssetList({
  email,
  userEmail,
  userRole,
}: EditStaffAssetListProps) {
  const [getResult, setGetResult] = useState<AssetProps>()

  const handleRemoveAsset = async (id: string) => {
    console.log('assetId', id)
    const updatedBy = userEmail
    const { success, message } = await deleteAssetById(id, { updatedBy })
    if (success) {
      toast[success ? 'success' : 'error'](message)
    }
    window.location.reload()
  }

  useEffect(() => {
    async function getAllAssetByEmail() {
      const { success, message, assetList } = await getAssetByStaffEmail({
        email,
      })
      setGetResult({ success, message, assetList })
    }
    getAllAssetByEmail()
  }, [email])

  return (
    <div className="max-w-sm max-h-fit p-6 bg-gray-700 border border-gray-200 rounded-lg">
      <span className="font-bold text-gray-50">Current Asset List:</span>
      {getResult?.success === true ? (
        <div className="gap-2 mt-2 ">
          {getResult.assetList.map((asset, index) => (
            <BoxRoot
              key={index}
              className="flex h-16 items-center p-2 shadow-sm hover:shadow-lg shadow-blue-500 bg-gray-700 rounded-md mb-4"
            >
              <div className="flex flex-col ">
                <BoxField
                  goToAsset={asset.id}
                  className="font-medium hover:underline hover:cursor-pointer max-w-fit"
                >
                  {asset.name}
                </BoxField>
                <span className="text-gray-200 text-sm">
                  <span className="text-gray-50">SN:</span> {asset.serialNumber}
                </span>
              </div>
              {userRole === 'admin' ? (
                <button
                  className="ml-auto flex items-center justify-center w-6 h-6 rounded-full hover:bg-red-500"
                  type="button"
                  onClick={() => handleRemoveAsset(asset.id)}
                >
                  <Icons.Trash2 className="text-gray-50 hover:text-gray-900 hover:cursor-pointer w-4 h-4" />
                </button>
              ) : (
                <span className="text-red-500 text-sm ml-auto"> </span>
              )}
            </BoxRoot>
          ))}
        </div>
      ) : (
        <div>
          <p>No asset assigned.</p>
        </div>
      )}
    </div>
  )
}
