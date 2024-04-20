import { useEffect, useState } from 'react'
import { sentApi, changeIsDeletedBySenderApi } from '../services/MailService'
import { LetterDataModel } from '../models/LetterModels'
import { handleError } from '../services/ErrorService'
import SentLetterPreview from './SentLetterPreview'
import { useAuth } from '../context/Context'
import { toast } from 'react-toastify'
import { VscTrash } from 'react-icons/vsc'

const Sent = () => {
  const [sent, setSent] = useState<LetterDataModel[]>([])
  const { user } = useAuth()
  const [isBarActive, setIsBarActive] = useState<boolean>(false)
  const [letterId, setLetterId] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')

  useEffect(() => {
    const fetchSent = async () => {
      try {
        const response = await sentApi(user!.id)
        setSent(response!.data)
      } catch (error) {
        handleError(error)
      }
    }
    fetchSent()
  }, [user])

  const checkboxHandler = (isActive: boolean, letterId: string) => {
    setIsBarActive(isActive)
    setLetterId(letterId)
  }

  const handleBinClick = async () => {
    try {
      await changeIsDeletedBySenderApi(letterId)
      await updateSent()
      toast.success('Moved to bin.')
    } catch (error) {
      handleError(error)
    }
  }

  const updateSent = async () => {
    try {
      const response = await sentApi(user!.id)
      setSent(response!.data)
    } catch (error) {
      handleError(error)
    }
  }

  const filteredSent = sent.filter(
    (letter) =>
      letter.subject.toLowerCase().includes(searchText.toLowerCase()) ||
      letter.body.toLowerCase().includes(searchText.toLowerCase()) ||
      letter.receiver.toLowerCase().includes(searchText.toLowerCase())
  )

  return sent.length === 0 ? (
    <div className='h-full w-full font-medium text-4xl tracking-tight flex flex-row justify-center items-center text-slate-300'>
      No sent letters
    </div>
  ) : (
    <div className='overflow-y-auto max-h-[700px]'>
      <table className='w-full h-full'>
        <thead className='w-full h-12 bg-white border border-slate-200 flex flex-row justify-between items-center sticky top-0 z-10'>
          <td className='w-auto h-full flex flex-row justify-center items-center pl-2'>
            <button
              disabled={!isBarActive}
              onClick={() => handleBinClick()}
              className={`flex flex-row justify-between items-center text-lg rounded-md px-3 py-0.5 ${
                isBarActive
                  ? 'bg-red-100 text-red-600 hover:bg-red-200 transition duration-100 ease-in-out'
                  : ' bg-gray-100 text-gray-400'
              }`}
            >
              Move to bin
              <VscTrash
                className='ml-2'
                size={20}
                color={`${isBarActive ? '#dc2626' : '#9ca3af'}`}
              />
            </button>
          </td>
          <td className='h-full w-3/12 px-2 py-1.5'>
            <input
              placeholder='Search'
              className='h-full w-full focus:outline-none focus:border-slate-300 rounded-md border-2 border-slate-200 px-2 text-lg'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </td>
        </thead>
        {filteredSent.map((letter) => (
          <SentLetterPreview
            key={letter.id}
            letterId={letter.id}
            receiverId={letter.receiverId}
            receiver={letter.receiver}
            subject={letter.subject}
            date={letter.date}
            action={checkboxHandler}
          />
        ))}
      </table>
    </div>
  )
}

export default Sent
