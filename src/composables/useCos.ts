// #ifdef H5
import COSH5 from 'cos-js-sdk-v5'
// #endif
// #ifdef MP-WEIXIN
// @ts-expect-error - cos-wx-sdk-v5 没有类型声明文件
import COSWx from 'cos-wx-sdk-v5'
// #endif

import { getCosTempSecretApi, uploadTempFileApi } from '@/api/system'

// 根据 platform 选择对应的 SDK
function getCOSClass() {
  // #ifdef H5
  return COSH5
  // #endif
  // #ifdef MP-WEIXIN
  return COSWx
  // #endif
}

export interface FileVo {
  fileId: string
  fileName: string
  fileUrl: string
  bucket: string
  region: string
  key: string
}

/**
 * COS 临时密钥响应数据
 */
interface CosSecretData {
  tmpSecretId: string
  tmpSecretKey: string
  sessionToken: string
  startTime: number
  expiredTime: number
  bucketFileName: string
  bucket: string
  region: string
}

/**
 * COS 临时密钥响应
 */
type CosSecretResponse = CosSecretData

/**
 * 创建 COS 实例的选项
 */
interface CreateCosOptions {
}

/**
 * COS 实例配置
 */
interface CosInstanceConfig {
  cosClass: any
  bucketFileName: string
  bucket: string
  region: string
}

/**
 * 上传文件选项
 */
interface UploadFileOptions extends CreateCosOptions {
  onlyUrl?: boolean
}

/**
 * 上传进度数据
 */
interface UploadProgressData {
  percent: number
  speed: number
}

/**
 * 上传成功结果
 */
interface UploadSuccessResult {
  fileId?: string
  fileName?: string
  fileUrl: string
  bucket?: string
  region?: string
  key?: string
}

/**
 * 上传文件参数类型
 */
type UploadFilePath = string | File

export function useCos() {
  /**
   * 创建 COS 实例
   * @param options 创建选项
   * @returns COS 实例配置
   */
  const createCosClass = async function (options: CreateCosOptions): Promise<CosInstanceConfig | undefined> {
    const secretInfo = await getCosTempSecretApi(options) as CosSecretResponse
    if (!secretInfo) {
      uni.showToast({
        title: 'COS密钥获取失败！',
        icon: 'none',
      })
      return
    }

    const COS = getCOSClass()
    const cosClass = new COS({
      SimpleUploadMethod: 'putObject',
      getAuthorization(_options: any, callback: (auth: any) => void) {
        callback({
          TmpSecretId: secretInfo.tmpSecretId,
          TmpSecretKey: secretInfo.tmpSecretKey,
          SecurityToken: secretInfo.sessionToken,
          StartTime: secretInfo.startTime,
          ExpiredTime: secretInfo.expiredTime,
        })
      },
    })

    if (!cosClass) {
      uni.showToast({
        title: 'COS实例化失败！',
        icon: 'none',
      })
      return
    }

    return {
      cosClass,
      bucketFileName: secretInfo.bucketFileName,
      bucket: secretInfo.bucket,
      region: secretInfo.region,
    }
  }

  /**
   * 上传文件到 COS
   * @param options 上传选项
   * @param uploadFile 文件路径
   * @param onSuccess 成功回调
   * @param onProgress 进度回调
   * @param onError 错误回调
   */
  const uploadFile = async function (
    options: UploadFileOptions,
    uploadFile: UploadFilePath,
    onSuccess: (result: UploadSuccessResult) => void,
    onProgress?: (progress: UploadProgressData) => void,
    onError?: (error: any) => void,
  ) {
    const config = await createCosClass(options)
    if (!config) {
      onError?.(new Error('COS实例创建失败'))
      return
    }

    const { cosClass, bucketFileName, bucket, region } = config
    const fileName = typeof uploadFile === 'string' ? uploadFile : uploadFile.name
    const finalBucketFileName = bucketFileName + fileName.slice(fileName.indexOf('.'))

    const fileOptions: Record<string, any> = {
      Bucket: bucket,
      Region: region,
      Key: finalBucketFileName,
      SliceSize: 1024 * 1024 * 5,
      onProgress(e: UploadProgressData) {
        onProgress?.(e)
      },
    }
    // #ifdef H5
    fileOptions.Body = uploadFile
    // #endif
    // #ifdef MP-WEIXIN
    fileOptions.FilePath = uploadFile
    // #endif
    cosClass.uploadFile(fileOptions, (err: Error, data: { Location: string }) => {
      if (err) {
        console.error('上传失败', err)
        onError?.(err)
        return
      }

      if (options.onlyUrl) {
        onSuccess({
          fileUrl: `https://${data.Location}`,
        })
        return
      }

      uploadTempFileApi({
        bucket,
        bucketFileName: finalBucketFileName,
        fileName,
      }).then((res: any) => {
        onSuccess({
          fileId: res,
          fileName,
          fileUrl: `https://${data.Location}`,
          bucket,
          region,
          key: finalBucketFileName,
        })
      }).catch((e: Error) => {
        console.error('上传文件记录失败:', e)
        onError?.(e)
      })
    })
  }

  return {
    uploadFile,
  }
}
