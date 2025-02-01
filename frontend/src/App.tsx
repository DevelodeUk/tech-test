import PersonForm from './components/PersonForm'
import PersonView from './components/PersonView'

function App() {

  return (
    <> 
   <div className='font-sans bg-gray-50 justify-center flex min-h-screen'>
    <div className=' flex flex-col lg:flex-row m-auto w-full md:w-auto mx-4'>
      <PersonForm />
      <div className='mt-4 lg:mt-0 lg:ml-40 flex w-full md:w-auto'>
        <div className='m-auto'>
          <PersonView />
        </div>
      </div>
    </div>
  </div>
  <p className='fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 hidden lg:block'>Charles Guerin Attempt At Harker Task</p>
    </>
  )
}

export default App
