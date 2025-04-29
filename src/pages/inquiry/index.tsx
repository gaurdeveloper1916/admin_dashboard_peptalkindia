// import { Outlet } from 'react-router-dom'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import AllInquiry from '../kanban/components/AllInquiry'

export default function inquiry() {
    return (
        <Layout fixed>
            <Layout.Header>
                <div className='ml-auto flex items-center space-x-4'>
                    <Search />
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </Layout.Header>
            <Layout.Body className='flex flex-col'>
                {/* <Outlet /> */}
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                    <AllInquiry />
                </div>
            </Layout.Body>
        </Layout>
    )
}
