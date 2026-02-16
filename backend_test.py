import requests
import sys
import json
import time
from datetime import datetime

class ChatbotAPITester:
    def __init__(self, base_url="https://chat-responder-10.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.conversation_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, stream=False):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                if stream:
                    response = requests.post(url, json=data, headers=headers, stream=True)
                else:
                    response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if stream:
                    return success, response
                else:
                    try:
                        return success, response.json()
                    except:
                        return success, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test("Root API Endpoint", "GET", "", 200)
        if success and isinstance(response, dict) and "message" in response:
            print(f"   Message: {response['message']}")
        return success

    def test_create_conversation(self, title="Test Chat"):
        """Test creating a new conversation"""
        success, response = self.run_test(
            f"Create Conversation: '{title}'",
            "POST",
            "conversations",
            200,
            data={"title": title}
        )
        if success and 'id' in response:
            conv_id = response['id']
            self.conversation_ids.append(conv_id)
            print(f"   Created conversation ID: {conv_id}")
            return conv_id
        return None

    def test_get_conversations(self):
        """Test retrieving all conversations"""
        success, response = self.run_test(
            "Get All Conversations",
            "GET",
            "conversations",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} conversations")
            for conv in response[:3]:  # Show first 3
                print(f"   - {conv.get('title', 'No title')} (ID: {conv.get('id', 'No ID')})")
        return success, response if success else []

    def test_send_message(self, conversation_id, message="Hello, can you help me with a simple math problem? What is 2+2?"):
        """Test sending a message and getting AI response"""
        success, response = self.run_test(
            f"Send Message to Conversation",
            "POST",
            f"conversations/{conversation_id}/messages",
            200,
            data={"content": message},
            stream=True
        )
        
        if success:
            print(f"   Message sent: {message[:50]}...")
            print("   Streaming AI response:")
            
            try:
                # Read streaming response
                ai_response = ""
                for line in response.iter_lines():
                    if line:
                        line_text = line.decode('utf-8')
                        try:
                            data = json.loads(line_text)
                            if data.get('type') == 'message':
                                ai_content = data.get('data', {}).get('content', '')
                                ai_response = ai_content
                                print(f"   AI Response: {ai_content[:100]}...")
                            elif data.get('type') == 'error':
                                print(f"   ❌ AI Error: {data.get('data')}")
                                return False
                        except json.JSONDecodeError:
                            continue
                
                if ai_response:
                    print(f"   ✅ Received AI response ({len(ai_response)} chars)")
                    return True
                else:
                    print(f"   ❌ No AI response received")
                    return False
                    
            except Exception as e:
                print(f"   ❌ Error reading stream: {e}")
                return False
        
        return False

    def test_get_messages(self, conversation_id):
        """Test retrieving messages for a conversation"""
        success, response = self.run_test(
            f"Get Messages for Conversation",
            "GET",
            f"conversations/{conversation_id}/messages",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} messages")
            for msg in response:
                role = msg.get('role', 'unknown')
                content = msg.get('content', '')[:50]
                print(f"   - {role}: {content}...")
        return success, response if success else []

    def test_delete_conversation(self, conversation_id):
        """Test deleting a conversation"""
        success, response = self.run_test(
            f"Delete Conversation",
            "DELETE",
            f"conversations/{conversation_id}",
            200
        )
        if success:
            print(f"   Conversation {conversation_id} deleted")
        return success

def main():
    print("🚀 Starting Chatbot API Tests")
    print("=" * 50)
    
    tester = ChatbotAPITester()
    
    # Test 1: Root endpoint
    if not tester.test_root_endpoint():
        print("❌ Root endpoint failed, stopping tests")
        return 1

    # Test 2: Create multiple conversations
    conv1_id = tester.test_create_conversation("Math Help Chat")
    conv2_id = tester.test_create_conversation("General Questions")
    
    if not conv1_id or not conv2_id:
        print("❌ Conversation creation failed, stopping tests")
        return 1

    # Test 3: Get all conversations
    success, conversations = tester.test_get_conversations()
    if not success:
        print("❌ Getting conversations failed")
        return 1

    # Test 4: Send message and get AI response
    if not tester.test_send_message(conv1_id, "What is 5 + 3?"):
        print("❌ Sending message failed")
        return 1

    # Wait a moment for AI processing
    time.sleep(2)

    # Test 5: Send another message to test conversation flow
    if not tester.test_send_message(conv1_id, "Can you explain how you solved that?"):
        print("❌ Second message failed")
        return 1

    # Test 6: Get messages to verify persistence
    success, messages = tester.test_get_messages(conv1_id)
    if not success:
        print("❌ Getting messages failed")
        return 1

    # Test 7: Send message to second conversation
    if not tester.test_send_message(conv2_id, "Tell me a fun fact about space"):
        print("❌ Message to second conversation failed")
        return 1

    # Test 8: Verify conversations list updated
    success, updated_conversations = tester.test_get_conversations()
    if not success:
        print("❌ Getting updated conversations failed")
        return 1

    # Test 9: Delete one conversation
    if not tester.test_delete_conversation(conv2_id):
        print("❌ Deleting conversation failed")
        return 1

    # Test 10: Verify deletion
    success, final_conversations = tester.test_get_conversations()
    if success:
        remaining_ids = [c.get('id') for c in final_conversations]
        if conv2_id not in remaining_ids:
            print("✅ Conversation deletion verified")
            tester.tests_passed += 1
        else:
            print("❌ Conversation not properly deleted")
        tester.tests_run += 1

    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())