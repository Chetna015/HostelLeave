import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { LeaveApplicationFormData } from '@/app/dashboard/student/apply-leave/page';

interface LeaveFormProps {
  register: UseFormRegister<LeaveApplicationFormData>;
  errors: FieldErrors<LeaveApplicationFormData>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export const LeaveForm = ({ register, errors, onSubmit }: LeaveFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">
          Leave Type
        </label>
        <input
          type="text"
          id="leaveType"
          {...register('leaveType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.leaveType && <p className="text-red-500 text-xs mt-1">{errors.leaveType.message}</p>}
      </div>

      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Reason
        </label>
        <textarea
          id="reason"
          {...register('reason')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>}
      </div>

      <div>
        <label htmlFor="destinationAddress" className="block text-sm font-medium text-gray-700">
          Destination Address
        </label>
        <input
          type="text"
          id="destinationAddress"
          {...register('destinationAddress')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.destinationAddress && <p className="text-red-500 text-xs mt-1">{errors.destinationAddress.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">
            Departure Date
          </label>
          <input
            type="date"
            id="departureDate"
            {...register('departureDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.departureDate && <p className="text-red-500 text-xs mt-1">{errors.departureDate.message}</p>}
        </div>
        <div>
          <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
            Return Date
          </label>
          <input
            type="date"
            id="returnDate"
            {...register('returnDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.returnDate && <p className="text-red-500 text-xs mt-1">{errors.returnDate.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">
          Departure Time
        </label>
        <input
          type="time"
          id="departureTime"
          {...register('departureTime')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.departureTime && <p className="text-red-500 text-xs mt-1">{errors.departureTime.message}</p>}
      </div>

      <div>
        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
          Emergency Contact
        </label>
        <input
          type="text"
          id="emergencyContact"
          {...register('emergencyContact')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact.message}</p>}
      </div>

      <div>
        <label htmlFor="transportMode" className="block text-sm font-medium text-gray-700">
          Transport Mode
        </label>
        <input
          type="text"
          id="transportMode"
          {...register('transportMode')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.transportMode && <p className="text-red-500 text-xs mt-1">{errors.transportMode.message}</p>}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          className="rounded-xl bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
