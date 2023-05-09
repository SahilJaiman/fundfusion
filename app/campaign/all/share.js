import React, { useState, useEffect } from 'react'
import { ShareAltOutlined } from '@ant-design/icons';
import { Button, Tooltip, Space, Row } from 'antd';
import { Modal } from 'antd';
import {
    FacebookIcon,
    LinkedinIcon,
    EmailShareButton,
    TwitterShareButton,
    WhatsappIcon,
    EmailIcon,
    FacebookShareButton,
    LinkedinShareButton,
    WhatsappShareButton,
    TwitterIcon,
} from "react-share";



const title = `Hey everyone👋, I wanted to share this funding campaign that I recently came across.\nI think this is an important cause and I would love to see it reach its goal.🤝💰 Please take a look and consider making a donation or sharing it with your own network.\nTogether, we can make a difference!💪🌍\n\n👇 Check out the campaign here! 👇\n`;

export default function ShareButton({ id }) {

    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };



    const handleCancel = () => {
        setOpen(false);
    };


    const shareUrl = `https://fundfusion.vercel.app/campaign/detail?id=${id}`;
    return (
        <div className='flex flex-row'>
            <Space direction="vertical" align="center">
                <Space wrap>
                    <Tooltip title="Share" placement='left'>
                        <Button className='flex items-center justify-center' type="dashed" onClick={showModal} shape="circle" >
                            <ShareAltOutlined />
                        </Button>

                    </Tooltip>
                </Space>
            </Space>
            <Modal
                open={open}
                centered
                title={<div className='text-xl' >Share</div>}
                onCancel={handleCancel}
                okButtonProps={{ style: { display: 'none' } }}
                cancelText="Back"
            >
                <p>Together, we can make a difference. </p>
                <Row className=' space-x-6 p-2'>
                    <div className="">
                        <FacebookShareButton
                            url={shareUrl}
                            quote={title}
                            className=""
                        >
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                    </div>

                    <div className="">
                        <WhatsappShareButton
                            url={shareUrl}
                            title={title}
                            separator=''
                            className=""
                        >
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                    </div>
                    <div className="">
                        <LinkedinShareButton url={shareUrl} className="">
                            <LinkedinIcon size={32} round />
                        </LinkedinShareButton>
                    </div>
                    <div>
                        <TwitterShareButton
                            url={shareUrl}
                            title={title}
                            className=""
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </div>
                    <div className="">
                        <EmailShareButton
                            url={shareUrl}
                            subject='Help us to make a Difference'
                            body={title}
                            className=""
                        >
                            <EmailIcon size={32} round />
                        </EmailShareButton>
                    </div>
                </Row>


            </Modal>

        </div>
    )
}