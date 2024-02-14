import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { Form, Upload } from 'antd';
import { DraggerProps, UploadChangeParam } from 'antd/lib/upload';
import { CloseCircleFilled, PaperClipOutlined, PlusOutlined } from '@ant-design/icons';

import { DocumentUploadType, IBasicInputProps, IUploadFile } from 'types/components/inputs';
import { PrimaryButton } from 'components/buttons';
import { getFileBase64 } from 'utils/file';

import styles from './DocumentUploadInput.module.scss';

interface IProps extends IBasicInputProps<Array<IUploadFile>>, Omit<DraggerProps, 'name' | 'onChange'> {
  documentType?: DocumentUploadType;
  buttonText?: string;
  value?: Array<IUploadFile>;
  labelIsBlack?: boolean;
}

const DocumentUploadInput = ({
  name,
  label,
  error,
  onChange,
  className = '',
  documentType = DocumentUploadType.File,
  buttonText,
  placeholder,
  maxCount = 10,
  value,
  disabled,
  labelIsBlack = false,
  ...rest
}: IProps) => {
  const { t } = useTranslation();
  const uploadTrigger = useRef<any>();
  const [fileList, setFileList] = useState<Array<IUploadFile>>(value || []);
  const [previewImage, setPreviewImage] = useState<string | undefined>(value?.[0]?.url);

  useEffect(() => {
    setFileList(value || []);
  }, [value]);

  const handleChange = async ({ fileList }: UploadChangeParam) => {
    let files;

    switch (documentType) {
      case DocumentUploadType.Image:
        files = [fileList[fileList.length - 1]];
        await handlePreview(files[0]);
        break;

      case DocumentUploadType.File:
      default:
        files = fileList;
    }

    setFileList(files);
    onChange && onChange(files);
  };

  const handlePreview = async (file: IUploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getFileBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
  };

  const handleRemove = (fileIndex: number) => {
    if (fileList[fileIndex]) {
      const files = fileList.filter((_, index) => index !== fileIndex);
      setFileList(files);
      onChange && onChange(files);
    }
  };

  const renderLabel = () => {
    const isAddButtonVisible = !disabled && fileList.length > 0 && fileList.length < maxCount;
    return (
      <div className={styles.labelWrapper}>
        <label className={labelIsBlack ? styles.blackLabel : ''}>{label}</label>
        {isAddButtonVisible && (
          <div className={styles.addButton} onClick={() => uploadTrigger.current?.click()}>
            <span className={styles.addButtonIcon}>
              <PlusOutlined />
            </span>
            {t('input.add')}
          </div>
        )}
      </div>
    );
  };

  const renderUploadBody = () => {
    if (fileList.length === 0) {
      return (
        <div className={styles.uploadWrapper}>
          <p className={styles.placeholder}>{placeholder}</p>
          <PrimaryButton size='small' className={styles.button}>
            {buttonText || t('input.uploadFile')}
          </PrimaryButton>
        </div>
      );
    }

    if (documentType === DocumentUploadType.Image && previewImage) {
      return (
        <div className={styles.previewImage}>
          <img src={previewImage} alt='' />
        </div>
      );
    }

    return fileList.map((file, index) => {
      return (
        <div key={`${name}-file-${index}`} className={styles.fileItem} onClick={(e) => e.stopPropagation()}>
          <div className={styles.fileItemTitle}>
            <PaperClipOutlined />
            <span>{file.name}</span>
            {error?.[index]?.size && <span className={styles.fileItemError}>{t('validation.invalidFileSize')}</span>}
          </div>
          <div className={styles.fileItemRemove}>
            {!disabled && <CloseCircleFilled onClick={() => handleRemove(index)} />}
          </div>
        </div>
      );
    });
  };

  return (
    <Form.Item
      name={name}
      help={Array.isArray(error) ? null : error}
      validateStatus={error ? 'error' : ''}
      className={styles.container}
    >
      {!!label && renderLabel()}
      <Upload.Dragger
        {...rest}
        disabled={disabled}
        beforeUpload={() => false}
        showUploadList={false}
        className={cn(styles.dropWrapper, className)}
        fileList={fileList}
        maxCount={maxCount}
        onChange={handleChange}
        onPreview={handlePreview}
      >
        <span ref={uploadTrigger} />
        {renderUploadBody()}
      </Upload.Dragger>
    </Form.Item>
  );
};

export default memo(DocumentUploadInput);
