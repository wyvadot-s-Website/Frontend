import {Outlet} from 'react-router-dom'
import logo from "../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png"
import wyv from '../../public/Subtract.png'
function AdminAuthLayout () {
    return (
        <div className="reltaive bg-white/45 h-screen flex justify-center items-center">
            <img src={logo} alt="" className="w-40 border-t-3 border-[#FF8D28] absolute top-0 left-0 pt-2 pl-4"/>
            <img
                src={wyv}
                alt=""
                className="absolute inset-0 m-auto -z-10 backdrop-blur-2xl blur-sm"
            />

            <Outlet/>
        </div>
    )
}

export default AdminAuthLayout