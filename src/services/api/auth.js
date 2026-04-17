import { apiConfig } from "~/config";
import { http } from "../http/request";

export const AuthAPI = {

  forgotPassword(payload){
    return http(`${apiConfig.endpoints.auth.forgotPassword}`, {
      method: "POST",
      body: payload
    }) 
  },
  verifyOTPResetPassword(payload){
    
    return http(`${apiConfig.endpoints.auth.verifyOtpResetPassword}`, {
      method: "POST",
      body: payload
    })
  },
  verifyOTPRegister(payload){
    
    return http(`${apiConfig.endpoints.auth.verifyOtpRegister}`, {
      method: "POST",
      body: payload
    })
  },
  resetPassword(payload){
    return http(`${apiConfig.endpoints.auth.resetPassword}`, {
      method: "PUT",
      body: payload,
      auth: false,
    })
  },
  resendOTP(payload){
    return http(`${apiConfig.endpoints.auth.resendOTP}`, {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  getTtlOtp(payload){
    return http(`${apiConfig.endpoints.auth.getTtlOtp}?email=${encodeURIComponent(payload?.email)}`, {
      method: "GET",
      body: payload,
      auth: false,
    })
  },
  googleLogin(payload){
    return http(`${apiConfig.endpoints.auth.googleLogin}`, {
      method: "POST",
      body: payload,
      auth: false,
    })
  },

  requestEmailChangeOtp(payload){
    return http(`${apiConfig.endpoints.auth.requestEmailChangeOtp}`, {
      method: "POST",
      body: payload,
      auth: true,
    })
  },

  confirmEmailChange(payload){
    return http(`${apiConfig.endpoints.auth.confirmEmailChange}`, {
      method: "POST",
      body: payload,
      auth: true,
    })
  },

  requestPasswordChangeOtp(payload){
    return http(`${apiConfig.endpoints.auth.requestPasswordChangeOtp}`, {
      method: "POST",
      body: payload,
      auth: true,
    })
  },

  confirmPasswordChange(payload){
    return http(`${apiConfig.endpoints.auth.confirmPasswordChange}`, {
      method: "POST",
      body: payload,
      auth: true,
    })
  },
}