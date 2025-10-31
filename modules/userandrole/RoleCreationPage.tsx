import RoleCreation from './components/RoleCreation'

const RoleCreationPage = () => {
  return (
    <div className='px-6 py-6 space-y-4'>
        <div>
            <nav className="text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
                <ol className="list-none p-0 inline-flex space-x-2">
                    <li className="flex items-center">
                        <a href="/user-management?tab=roles" className="hover:underline">User & Role Management</a>
                        <svg className="h-4 w-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                    </li>
                    <li className="flex items-center">
                        <span className="text-gray-700 font-medium">Create Role</span>
                    </li>
                </ol>
            </nav>
        </div>
        <div className='flex flex-col'>
            <h1 className="text-2xl font-semibold">Create New Role</h1>
            <p className="text-gray-600">Define a role name and select permissions for modules</p>
        </div>
        <RoleCreation />
    </div>
  )
}

export default RoleCreationPage