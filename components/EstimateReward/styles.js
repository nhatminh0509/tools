import styled from 'styled-components'

export const EstimateRewardContainer = styled.div`
  width: 100%;
  padding: 15px;
  position: relative;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 10, 0.2);
  &::before {
    z-index: 1;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(130.04deg, #a4f240 -0.23%, #fee33e 100.21%);
    opacity: 0.1;
    border-radius: 10px;
  }
`

export const Title = styled.p`
  margin: 0;
  font-weight: 700;
  font-size: 22px;
  line-height: 31px;
  color: #ffffff;
`

export const InfoContainer = styled.div`
  margin-top: 15px;
  width: 100%;
  min-height: 140px;
  padding: 20px 25px;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    z-index: -1;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(106.23deg, #a4f240 0.19%, #fee33e 99.78%);
    opacity: 0.4;
    border-radius: 10px;
  }
`

export const ContentInfo = styled.div`
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 100%;
`

export const TextContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Text = styled.div`
  max-width: 100%;
  font-weight: 900;
  font-size: 30px;
  line-height: 38px;
  color: #ffffff;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`

export const SubText = styled.div`
  margin-top: 5px;
  margin-left: 5px;
  font-weight: 700;
  font-size: 22px;
  line-height: 30px;
  color: #ffffff;
`
