import { Text, Footer, FooterTab, Button, Icon } from 'native-base';

function AFooter() {
  return (
    <Footer>
      <FooterTab>
        <Button active vertical>
          <Icon active name="apps" />
          <Text>Budget</Text>
        </Button>
        <Button vertical>
          <Icon name="camera" />
          <Text>Balances</Text>
        </Button>
        <Button vertical>
          <Icon name="navigate" />
          <Text>Reports</Text>
        </Button>
        <Button vertical>
          <Icon name="person" />
          <Text>Settings</Text>
        </Button>
      </FooterTab>
    </Footer>
  );
}
