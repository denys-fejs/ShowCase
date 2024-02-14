import { RowSpace } from 'types/components/grid';
import DataRow from 'components/typography/data-row';
import { Row, Col } from 'components/grid';

interface IProps {
  company: string;
  phone: string;
  address: string;
  website: string;
}

const ProjectContacts = ({ company, phone, address, website }: IProps) => {
  return (
    <>
      <Row verticalSpace={RowSpace.ExtraSmall} horizontalSpace={RowSpace.Small}>
        {company && (
          <Col>
            <DataRow data={company} icon='company' label='Company' />
          </Col>
        )}
        {address && (
          <Col>
            <DataRow data={address} icon='mapPoint' label='Address' />
          </Col>
        )}
        {phone && (
          <Col>
            <DataRow data={phone} icon='phone' label='Phone' />
          </Col>
        )}
        {website && (
          <Col>
            <DataRow link={website} data={website} icon='website' label='Website' />
          </Col>
        )}
      </Row>
    </>
  );
};

export default ProjectContacts;
